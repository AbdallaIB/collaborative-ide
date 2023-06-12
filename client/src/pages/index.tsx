import { getMyProjects, deleteProject, createProject } from '@api/project';
import { IProject, ProjectCreateInput, ProjectJoinInput } from '@api/types';
import Modal from '@components/modal';
import CreateProject from '@components/project/CreateProjectForm';
import JoinProject from '@components/project/JoinProjectForm';
import ProjectCard from '@components/project/ProjectCard';
import SearchBar from '@components/searchbar';
import Button from '@components/shared/button';
import useModal from '@lib/hooks/useModal';
import useToast from '@lib/hooks/useToast';
import useAuthStore from '@lib/stores/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
  const { errorMessage, promise } = useToast();
  const { token, authUser, logout } = useAuthStore();
  const { isModalOpen, setIsModalOpen } = useModal();
  const [currentModal, setCurrentModal] = useState<'join' | 'create'>('create');
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('IndexPage', authUser, token);
    fetchData();
    if (!authUser || !token) {
      logout();
      navigate('/login');
    }
  }, []);

  const fetchData = async () => {
    try {
      const projects = (await getMyProjects()).projects;
      console.log('IndexPage', projects);
      setProjects(projects);
    } catch (err: any) {
      errorMessage(err);
    }
  };

  const search = (items: IProject[]) => {
    if (query === '') return items;
    return items.filter((item) => {
      const searchQuery = query ? item['title'].toLowerCase().includes(query) : true;
      return searchQuery;
    });
  };

  const openProject = (id: string) => {
    navigate(`/code/${id}`);
  };

  const handleCreateProject = async (values: ProjectCreateInput) => {
    try {
      const createProjectPromise = createProject(values);
      promise(createProjectPromise, {
        loading: 'Creating project...',
        success: 'Project created!',
        error: 'Failed to create project',
      });
      const project = (await createProjectPromise).project;
      setProjects([...projects, project]);
      setIsModalOpen(false);
    } catch (err: any) {
      errorMessage(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const deleteProjectPromise = deleteProject(id);
      promise(deleteProjectPromise, {
        loading: 'Deleting project...',
        success: 'Project deleted!',
        error: 'Failed to delete project',
      });
      await deleteProjectPromise;
      setProjects(projects.filter((project) => project.id !== id));
    } catch (err: any) {
      errorMessage(err);
    }
    console.log('delete', id);
  };

  const handleJoinProject = (values: ProjectJoinInput) => {
    const { sessionId, username } = values;
    localStorage.setItem('username', username);
    setIsModalOpen(false);
    if (sessionId) openProject(sessionId);
  };

  const handleModal = (type: 'join' | 'create', open: boolean) => {
    setCurrentModal(type);
    setIsModalOpen(open);
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="leading-relaxed font-primary font-extrabold text-4xl text-center text-main dark:text-main mt-4 py-2 sm:py-4">
          Projects
        </h1>
        <div className="flex flex-row items-center justify-center gap-4 whitespace-nowrap h-8 text-gray-600 dark:text-main_side">
          <SearchBar value={query} setValue={(e) => setQuery(e.toLowerCase())} placeholder={'Search for a Project'} />
          <Button text={'Create Project'} onClick={() => handleModal('create', true)} isPrimary></Button>
          <Button text={'Join Session'} onClick={() => handleModal('join', true)} color="gray"></Button>
        </div>
        {search(Object.values(projects)).length === 0 ? (
          <div className="mt-40 text-gray-600 dark:text-main_side">
            <p>No projects found.</p>
          </div>
        ) : (
          <div className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 w-[90%]">
            {search(Object.values(projects)).map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                openProject={openProject}
                deleteProject={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>
      <Modal
        hasFooter={false}
        styles={{ content: { height: 'auto', width: 'auto' } }}
        isOpen={isModalOpen}
        title={currentModal === 'create' ? 'Create Project' : 'Join Session'}
        cancel={() => {
          setIsModalOpen(false);
        }}
        confirm={() => {}}
        confirmText="Create Project"
      >
        {currentModal === 'create' ? (
          <CreateProject onCreateProject={handleCreateProject} />
        ) : (
          <JoinProject onJoinProject={handleJoinProject} />
        )}
      </Modal>
    </section>
  );
};

export default IndexPage;
