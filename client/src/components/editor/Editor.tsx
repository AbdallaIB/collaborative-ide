import { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import './EditorAddons';
import { JSHINT, LintError } from 'jshint';
import { HTMLHint } from 'htmlhint';
import { Hint } from 'htmlhint/types';
import { generateColor } from '@utils/colorGenerator';
import { Doc, EditorData, ProviderUser } from '@pages/code';
import { Doc as YjsDoc, UndoManager } from 'yjs';
import useToast from '@lib/hooks/useToast';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import { getAuthHeaders } from '@api/index';

interface Props {
  doc: Doc;
  sessionId: string;
  value: string;
  username: string;
  showEditor: boolean;
  onValueChange: (value: string, type: string) => void;
  initEditor: (editor: EditorData) => void;
}

const Editor = ({ doc, sessionId, username, value, showEditor, onValueChange, initEditor }: Props) => {
  const { error, errorMessage } = useToast();
  const [waiting, setWaiting] = useState<NodeJS.Timeout>();
  const EditorRef = useRef(null);

  useEffect(() => {
    if (!EditorRef) return;
    let provider: WebsocketProvider | null = null;
    let yjsDoc: YjsDoc | null = null;
    let binding: CodemirrorBinding | null = null;
    const user: ProviderUser = {
      name: username,
      color: generateColor([]),
      initials: username[0].toUpperCase(),
    };
    try {
      const editorElem = EditorRef.current as any;
      const editor = CodeMirror(editorElem, {
        mode: doc.mode,
        value,
        lineNumbers: true,
        theme: 'material-darker',
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        matchTags: true,
        lint: true,
        indentWithTabs: true,
        showHint: true,
        lineWrapping: true,
        styleActiveLine: true,
        showCursorWhenSelecting: true,
        scrollbarStyle: 'native',
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'gutter-error'],
      });

      // yjs Doc
      yjsDoc = new YjsDoc({
        meta: {
          sessionId,
          user,
        },
      });

      // provider
      const websocketEndpoint = process.env.WEBSOCKET_ENDPOINT;
      if (!websocketEndpoint) {
        error('Websocket endpoint not found');
        return;
      }

      provider = new WebsocketProvider(websocketEndpoint, `${sessionId}-${doc.name}`, yjsDoc, {
        params: getAuthHeaders(),
      });
      if (!provider) return;
      // A Yjs document holds the shared data
      provider.on('status', (event: { status: string }) => {
        console.log(event);
        if (event.status === 'connected') {
          (provider! as any).user = user;
          //   console.log(provider);
          initEditor({
            editor,
            provider,
          });
        }
      });
      provider.on('error', () => {
        error('Error in collaborating try refreshing or come back later!');
      });

      // create binding
      const yText = yjsDoc.getText('codemirror');
      const yUndoManager = new UndoManager(yText!);
      binding = new CodemirrorBinding(yText, editor, provider.awareness, {
        yUndoManager,
      });

      binding.awareness.setLocalStateField('user', user);

      editor.on('change', () => {
        onValueChange(editor.getValue(), editor.getMode().name || '');
        clearTimeout(waiting);
        setWaiting(setTimeout(() => updateHints(editor), 500));
      });
    } catch (err) {
      console.log('Error: ', err);
      errorMessage(err);
    }
    return () => {
      if (provider) provider.destroy();
      if (yjsDoc) yjsDoc.destroy();
      if (binding) binding.destroy();
    };
  }, [EditorRef]);

  const updateHints = (editor: CodeMirror.Editor) => {
    editor.operation(() => {
      const messages = getErrors(editor);
      if (!messages) return;
      highlightError(editor, messages);
    }); // end of editor.operation
  };

  const getErrors = (editor: CodeMirror.Editor) => {
    console.log('selectedDoc getErrors', editor.getMode().name);
    switch (editor.getMode().name) {
      case 'javascript': {
        JSHINT(editor.getValue(), {
          esversion: 6,
          asi: true,
        });
        return JSHINT.errors;
      }
      case 'htmlmixed':
        return HTMLHint.verify('<!DOCTYPE html> ' + editor.getValue(), {
          'attr-value-double-quotes': false,
        });
      default:
        return [];
    }
  };

  const highlightError = (editor: CodeMirror.Editor, errors: LintError[] | Hint[]) => {
    editor.clearGutter('gutter-error');
    if (editor.getMode().name === 'css') return;
    for (const element of errors) {
      const error: any = element;
      const errorLine = error['line'] - 1;

      const marker = document.createElement('div');
      marker.setAttribute('class', 'gutter-error bx bx-error-circle w-6 text-red-500');
      marker.setAttribute('data-toggle', 'tooltip');
      marker.setAttribute('data-placement', 'right');
      const code = error && error['code'] ? error['code'] : '';
      const reason = error && error['reason'] ? error['reason'] : error['message'];
      marker.setAttribute('title', '(Error ' + code + ') ' + reason);
      editor.setGutterMarker(errorLine, 'gutter-error', marker);
    }
  };

  return (
    <div
      ref={EditorRef}
      id={doc.name}
      style={{
        display: showEditor ? 'flex' : 'none',
        height: '100%',
        width: '100%',
        fontSize: '20px',
        overflowY: 'auto',
      }}
    ></div>
  );
};

export default Editor;
