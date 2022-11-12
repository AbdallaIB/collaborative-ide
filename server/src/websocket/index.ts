import { updateProjectById } from '@services/project';
import { verifyJwt } from '@utils/jwt';
import { IncomingMessage } from 'http';
import { Server } from 'ws';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import { applyUpdate, Doc, encodeStateAsUpdate } from 'yjs';

type ProjectData = {
  js: string;
  css: string;
  html: string;
};

export const initWebsocket = (server) => {
  const wss = new Server({ noServer: true });
  let user = null;
  let projectId = '';
  let projectData: ProjectData = {
    js: '',
    css: '',
    html: '',
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const saveData = async (id: string, data: ProjectData) => {
    if (!id) return;
    console.log('saving data', { id, data }, user);
    if (user && user.uId) {
      console.log('user', user);
      await updateProjectById(id, user.uId, data);
    }
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
    writeState: (documentName: string, doc: Doc) => {
      const docId = documentName.split('-')[0];
      const docType = documentName.split('-')[1];
      const yText = doc.getText('codemirror');
      const content = yText.toString();
      projectData[docType] = content;
      projectId = docId;
      saveData(projectId, projectData);
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

  server.on('upgrade', (request: IncomingMessage, socket, head) => {
    // You may check auth of request here..
    if (!user) {
      const url = new URLSearchParams(request.url);
      const authToken = url.get('Authorization');
      if (authToken) {
        const authData = verifyJwt(authToken.split(' ')[1]);
        if (authData) user = authData;
      }
    }
    const handleAuth = (ws) => {
      wss.emit('connection', ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
  });
};
