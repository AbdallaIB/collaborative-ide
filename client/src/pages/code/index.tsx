import { useLocalStorage } from '@lib/hooks/useLocalStorage';
import { useEffect, useRef, useState } from 'react';
import './index.css';
import Editor from '@components/editor/Editor';
import EditorSidebar from '@components/editor/EditorSidebar';
import CodeMirror from 'codemirror';
import ActiveDocTab from '@components/editor/ActiveDocTab';
import ContentPresenter from '@components/editor/ContentPresenter';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, updateProject } from '@api/project';
import useAuthStore from '@lib/stores/auth';
import JoinProject from '@components/project/JoinProjectForm';
import { ProjectJoinInput } from '@api/types';
import ProjectHeader from '@components/project/ProjectHeader';
import Modal from '@components/modal';
import WebsocketService from '@services/WebsocketService';
import useToast from '@lib/hooks/useToast';

export type EditorDoc = 'js' | 'html' | 'css';

export type Doc = {
  name: EditorDoc;
  mode: string;
  content: string;
  icon: string;
  color: string;
};

export const docsDetails: Doc[] = [
  { name: 'js', mode: 'javascript', content: '', icon: 'bx bxl-javascript', color: '#FCDC00' },
  { name: 'html', mode: 'htmlmixed', content: '', icon: 'bx bxl-html5', color: '#DD4A23' },
  { name: 'css', mode: 'css', content: '', icon: 'bx bxl-css3', color: '#264DE4' },
];

const fiveMinutes = 300000;

const Code = () => {
  let { id } = useParams();
  const { errorMessage } = useToast();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useLocalStorage('username', authUser?.username || '');
  const saveIntervalRef = useRef<NodeJS.Timer>();
  const [showJoinProject, setShowJoinProject] = useState(false);
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJs] = useLocalStorage('js', '');
  const [contentSrc, setContentSrc] = useState('');
  const [docs, setDocs] = useState<{ [key in EditorDoc]: CodeMirror.Doc } | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<EditorDoc>('js');

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log({ html, css, js });
      setContentSrc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  useEffect(() => {
    if (!username) {
      setShowJoinProject(true);
      return;
    }

    fetchData();

    // handle page refresh
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    // window.addEventListener('beforeunload', unloadCallback);
    return () => {
      window.removeEventListener('beforeunload', unloadCallback);
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  const fetchData = async () => {
    if (!id) return navigate('/');
    try {
      const { css, js, html, ownerId } = (await getProjectById(id)).project;
      handleAutomaticProjectSave(ownerId);
      setCss(css);
      setJs(js);
      setHtml(html);
    } catch (err) {
      errorMessage('Project not found');
      navigate('/');
    }
  };

  const handleJoinProject = (values: ProjectJoinInput) => {
    setUsername(values.username);
    setShowJoinProject(false);
  };

  const handleEditorChange = (value: string, type: string) => {
    if (!value) return;
    switch (type) {
      case 'htmlmixed':
        setHtml(value);
        return;
      case 'css':
        setCss(value);
        return;
      case 'javascript':
        setJs(value);
        return;
      default:
        return;
    }
  };

  const selectDoc = (doc: EditorDoc) => {
    let { editor } = WebsocketService;
    console.log('selectedDoc', doc, docs, editor);
    if (!docs || !editor) return;
    const updatedEditor = editor;
    updatedEditor.swapDoc(docs[doc]);
    editor = updatedEditor;
    console.log('before set selectedDoc', selectedDoc, doc, editor.modeOption);
    setSelectedDoc(doc);
    editor.modeOption = docsDetails.filter((doc) => doc.name === selectedDoc)[0].mode;
    console.log('after set selectedDoc', selectedDoc, doc, editor.modeOption);
  };

  const createDocs = () => {
    const value = { js, css, html };
    docsDetails.forEach((doc) => {
      const { name, mode } = doc;
      setDocs((prevDocs: any) => {
        return {
          ...prevDocs,
          [name]: CodeMirror.Doc(value[name], mode),
        };
      });
    });
  };

  const handleAutomaticProjectSave = (ownerId: string) => {
    if (!id) return;
    const user = authUser;
    if (!user || user.uId !== ownerId) return;
    saveIntervalRef.current = setInterval(() => {
      if (!id) return;
      updateProject(id, { html, css, js });
    }, fiveMinutes);
  };

  return (
    <div className="flex w-full max-w-screen h-full overflow-hidden">
      {!showJoinProject ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex w-full">
            <ProjectHeader leaveSession={() => navigate('/')} sessionId={id || ''}></ProjectHeader>
          </div>
          <div className="flex flex-row w-full h-full overflow-x-hidden relative">
            <EditorSidebar
              onDocSelect={(doc) => selectDoc(doc)}
              docs={docsDetails}
              selectedDoc={selectedDoc}
            ></EditorSidebar>
            <div className="flex flex-row w-full h-full">
              <div className="flex flex-col w-[65%] h-full">
                <div className="editor-title border-b border-main_dark bg-main_black">
                  <ActiveDocTab selectedDoc={docsDetails.filter((doc) => doc.name === selectedDoc)[0]}></ActiveDocTab>
                </div>
                <div className={`editor-container`}>
                  {username && (
                    <Editor
                      username={username}
                      sessionId={id!}
                      createDocs={createDocs}
                      onValueChange={handleEditorChange}
                    />
                  )}
                </div>
              </div>
              <ContentPresenter contentSrc={contentSrc}></ContentPresenter>
            </div>
          </div>
        </div>
      ) : (
        <Modal
          isCancellable={false}
          hasFooter={false}
          styles={{ content: { height: 'auto', width: 'auto' } }}
          isOpen={showJoinProject}
          title={'Join Session'}
          cancel={() => {
            setShowJoinProject(false);
          }}
          confirm={() => {}}
          confirmText="Create Project"
        >
          <JoinProject onJoinProject={handleJoinProject}></JoinProject>
        </Modal>
      )}
    </div>
  );
};

export default Code;
