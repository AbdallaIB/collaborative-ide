import { Server } from 'ws';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import { applyUpdate, Doc, encodeStateAsUpdate } from 'yjs';

export const initWebsocket = (server) => {
  const wss = new Server({ noServer: true });

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  setPersistence({
    bindState: async (documentName: string, doc: Doc) => {
      await delay(1000); // some random delay to signify retrieving data from db

      const yText = doc.getText('codemirror');
      yText.insert(0, '');
      const encodedState = encodeStateAsUpdate(doc);
      doc.on('update', (update) => {
        applyUpdate(doc, update);
      });

      return applyUpdate(doc, encodedState);
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
