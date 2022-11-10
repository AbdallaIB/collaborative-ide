import { CodemirrorBinding } from 'y-codemirror';
import { WebsocketProvider } from 'y-websocket';
import { Doc as YjsDoc, UndoManager } from 'yjs';
import { YText } from 'yjs/dist/src/types/YText';

export type ProviderUser = {
  name: string;
  color: string;
  initials: string;
};

class WebsocketService {
  public provider: WebsocketProvider | null = null;
  public doc: YjsDoc | null = null;
  public binding: CodemirrorBinding | null = null;
  public participants: ProviderUser[] | null = null;
  public editor: CodeMirror.Editor | null = null;

  public async initProvider(sessionId: string, user: ProviderUser, editor: CodeMirror.Editor): Promise<string> {
    return new Promise((rs, rj) => {
      const websocketEndpoint = process.env.WEBSOCKET_ENDPOINT;
      if (!websocketEndpoint) return rj('Websocket endpoint not found');
      this.doc = new YjsDoc({
        meta: {
          sessionId,
          user,
        },
      });
      this.provider = new WebsocketProvider(websocketEndpoint, sessionId, this.doc);
      // A Yjs document holds the shared data
      this.provider.on('status', (event: { status: string }) => {
        console.log(event);
        if (event.status === 'connected') {
          this.editor = editor;
          (this.provider! as any).user = user;
          rs('connected');
        }
      });
      this.provider.on('error', () => {
        alert('error in collaborating try refreshing or come back later !');
        rj();
      });
    });
  }

  public async setProviderUser(user: ProviderUser): Promise<void> {
    return new Promise((rs) => {
      if (this.provider) {
        this.provider.awareness.setLocalStateField('user', user);
        rs();
      }
    });
  }

  public async createEditorBinding(yText: YText, editor: CodeMirror.Editor, yUndoManager: UndoManager): Promise<void> {
    return new Promise((rs) => {
      if (this.provider) {
        this.binding = new CodemirrorBinding(yText, editor, this.provider.awareness, {
          yUndoManager,
        });
        rs();
      }
    });
  }

  public disconnect(): void {
    try {
      if (this.provider && this.doc && this.binding) {
        this.provider.disconnect(); //We destroy doc we created and disconnect
        this.doc.destroy(); //the provider to stop propagating changes if user leaves editor
        this.binding.destroy(); //We destroy the binding to stop listening to changes;
      }
    } catch (error) {}
  }
}

export default new WebsocketService();
