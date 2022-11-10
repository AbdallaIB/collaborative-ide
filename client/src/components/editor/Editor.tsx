import { useEffect, useRef, useState } from 'react';
import { UndoManager } from 'yjs';
import CodeMirror from 'codemirror';
import './EditorAddons';
import { JSHINT, LintError } from 'jshint';
import { HTMLHint } from 'htmlhint';
import { Hint } from 'htmlhint/types';
import WebsocketService, { ProviderUser } from '@services/WebsocketService';
import { generateColor } from '@utils/colorGenerator';

interface Props {
  sessionId: string;
  username: string;
  onValueChange: (value: string, type: string) => void;
  createDocs: () => void;
}

const Editor = ({ sessionId, username, onValueChange, createDocs }: Props) => {
  const [waiting, setWaiting] = useState<NodeJS.Timeout>();
  const EditorRef = useRef(null);

  useEffect(() => {
    return WebsocketService.disconnect();
  }, []);

  useEffect(() => {
    if (!EditorRef) return;
    initEditor();
  }, [EditorRef]);

  const initEditor = (): void => {
    const user = {
      name: username,
      color: generateColor([]),
      initials: username[0].toUpperCase(),
    };
    try {
      const editorElem = EditorRef.current as any;
      const editor = CodeMirror(editorElem, {
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

      // create docs
      createDocs();

      initProvider(user, editor);

      const yText = WebsocketService.doc?.getText('codemirror');

      const yUndoManager = new UndoManager(yText!);

      WebsocketService.setProviderUser(user);

      WebsocketService.createEditorBinding(yText!, editor, yUndoManager);

      editor.on('change', () => {
        const { editor } = WebsocketService;
        if (!editor) return;
        onValueChange(editor.getValue(), editor.getMode().name || '');
        clearTimeout(waiting);
        setWaiting(setTimeout(() => updateHints(editor), 500));
      });
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const initProvider = async (user: ProviderUser, editor: CodeMirror.Editor) => {
    try {
      await WebsocketService.initProvider(sessionId, user, editor);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

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
        JSHINT(editor.getValue());
        return JSHINT.errors;
      }
      case 'htmlmixed':
        return HTMLHint.verify('<!DOCTYPE html> ' + editor.getValue());
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
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        fontSize: '20px',
        overflowY: 'auto',
      }}
    ></div>
  );
};

export default Editor;
