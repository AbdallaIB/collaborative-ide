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
import useToast from '@lib/hooks/useToast';
import { WebsocketProvider } from 'y-websocket';

export type ProviderUser = {
  name: string;
  color: string;
  initials: string;
};

export type EditorDoc = 'js' | 'html' | 'css';

export type EditorData = {
  editor: CodeMirror.Editor | null;
  provider: WebsocketProvider | null;
};

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

const twoMinutes = 120000;

const Code = () => {
  let { id } = useParams();
  const { errorMessage, promise } = useToast();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useLocalStorage('username', authUser?.username || '');
  const [ownerId, setOwnerId] = useState('');
  const saveIntervalRef = useRef<NodeJS.Timer>();
  const [showJoinProject, setShowJoinProject] = useState(false);
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [contentSrc, setContentSrc] = useState('');
  const [participants, setParticipants] = useState<ProviderUser[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<EditorDoc>('js');
  const defaultEditor = {
    editor: null,
    provider: null,
  };
  const [editors, setEditors] = useState<{ [key in EditorDoc]: EditorData }>({
    js: defaultEditor,
    html: defaultEditor,
    css: defaultEditor,
  });

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
    const interval = setInterval(() => {
      const provider = editors.js.provider;
      if (provider) {
        const states = provider?.awareness.states;
        if (!states) return;
        const participants: ProviderUser[] = [];
        states.forEach((state) => {
          const user = state.user as ProviderUser;
          if (user) participants.push(user);
        });
        setParticipants(participants);
      }
    }, 500);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [editors.js]);

  useEffect(() => {
    if (!username) {
      setShowJoinProject(true);
      return;
    }

    fetchData();

    // handle page refresh
    const unloadCallback = async (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => {
      window.removeEventListener('beforeunload', unloadCallback);
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  const fetchData = async () => {
    if (!id) return navigate('/');
    if (!authUser) return;
    try {
      const { css, js, html, ownerId } = (await getProjectById(id)).project;
      setOwnerId(ownerId);
      handleAutomaticProjectSave(ownerId);
      setCss(css);
      setJs(js);
      setHtml(html);
      selectDoc('js');
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
    const editor = editors[doc].editor;
    if (!editor) return;
    setSelectedDoc(doc);
    setTimeout(() => {
      const value = selectedDoc === 'js' ? js : selectedDoc === 'html' ? html : css;
      editor.setValue(value);
      editor.setCursor(value.length || 0);
      editor.refresh();
      editor.focus();
    }, 10);
  };

  const handleAutomaticProjectSave = (ownerId: string) => {
    if (!id || !authUser || authUser.uId !== ownerId) return;
    saveIntervalRef.current = setInterval(() => {
      if (!id) return;
      promise(updateProject(id, { html, css, js }), {
        loading: 'Saving project...',
        success: 'Project saved!',
        error: 'Failed to save project',
      });
    }, twoMinutes);
  };

  const handleLeaveSession = async (isLeaving: boolean) => {
    console.log(id, authUser, authUser!.uId === ownerId, ownerId);
    if (id && authUser) {
      console.log('saving project');
      const updateProjectPromise = updateProject(id, { html, css, js });
      promise(updateProjectPromise, {
        loading: 'Saving project...',
        success: 'Project saved!',
        error: 'Failed to save project',
      });
      await updateProjectPromise;
      console.log('project saved');
    }
    if (isLeaving) navigate('/');
  };

  return (
    <div className="flex w-full max-w-screen h-full overflow-hidden">
      {!showJoinProject ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex w-full">
            <ProjectHeader
              participants={participants}
              leaveSession={() => handleLeaveSession(true)}
              sessionId={id || ''}
            ></ProjectHeader>
          </div>
          <div className="flex flex-row w-full h-full overflow-x-hidden relative">
            <EditorSidebar
              onDocSelect={(doc) => selectDoc(doc)}
              docs={docsDetails}
              selectedDoc={selectedDoc}
            ></EditorSidebar>
            <div className="flex flex-col w-[65%] h-full">
              <div className="editor-title border-b border-main_dark bg-main_black">
                <ActiveDocTab selectedDoc={docsDetails.filter((doc) => doc.name === selectedDoc)[0]}></ActiveDocTab>
              </div>
              <div className="editor-container">
                {username &&
                  docsDetails.map((doc: Doc) => {
                    return (
                      <Editor
                        key={doc.name}
                        doc={doc}
                        value={selectedDoc === 'js' ? js : selectedDoc === 'html' ? html : css}
                        username={username}
                        showEditor={selectedDoc === doc.name}
                        sessionId={id!}
                        onValueChange={handleEditorChange}
                        initEditor={({ editor, provider }: EditorData) => {
                          if (!editor || !provider) return;
                          setEditors((prevEditors) => {
                            const obj = { ...prevEditors };
                            obj[doc.name] = { editor, provider };
                            return obj;
                          });
                        }}
                      />
                    );
                  })}
              </div>
            </div>
            <ContentPresenter contentSrc={contentSrc}></ContentPresenter>
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
