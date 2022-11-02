import { Server } from 'ws';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import { applyUpdate, encodeStateAsUpdate } from 'yjs';

const cells = [
  {
    metadata: {
      id: '1',
    },
    source: [
      '# Write your code below:\n',
      'something = "2"\n',
      'something2 = 5\n',
      'print(something + something2)\n',
      '\n',
      'list = []\n',
      'for num in range(1,11):\n',
      '    list.append(num)\n',
      '\n',
      'print(list)',
      '\n',
    ],
  },
  {
    metadata: {
      id: '2',
    },
    source: [
      'data = [73284, 8784.3, 9480938.2, 984958.3, 24131, 45789, 734987, 23545.3, 894859.2, 842758.3]\n',
      '\n',
      '# Write your code below:\n',
      'maximum = data[0]\n',
      '\n',
      'for num in data:\n',
      '    if(num > maximum):\n',
      '        maximum = num\n',
      '\n',
      'print(maximum)',
      '\n',
    ],
  },
];

export const initWebsocket = (server) => {
  const wss = new Server({ noServer: true });

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  setPersistence({
    bindState: async (documentName: string, doc: any) => {
      await delay(1000); // some random delay to signify retrieving data from db

      //documentName refers to the id of the cell in the db which the frontend will have
      const foundCell = cells.find((cell) => cell.metadata.id === documentName);

      const foundSourceCode = foundCell?.source.join('') as string;

      const yText = doc.getText('codemirror');
      yText.insert(0, '');
      const ecodedState = encodeStateAsUpdate(doc);

      doc.on('update', (update) => {
        applyUpdate(doc, update);
      });

      return applyUpdate(doc, ecodedState);
      // Here you listen to granular document updates and store them in the database
      // You don't have to do this, but it ensures that you don't lose content when the server crashes
      // See https://github.com/yjs/yjs#Document-Updates for documentation on how to encode
      // document updates
    },
    writeState: (_identifier, _doc) => {
      // This is called when all connections to the document are closed.
      // In the future, this method might also be called in intervals or after a certain number of updates.
      return new Promise<void>((resolve) => {
        // When the returned Promise resolves, the document will be destroyed.
        // So make sure that the document really has been written to the database.
        resolve();
      });
    },
  });

  wss.on('connection', setupWSConnection);

  server.on('upgrade', (request, socket, head) => {
    // You may check auth of request here..

    const handleAuth = (ws) => {
      wss.emit('connection', ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
  });
};
