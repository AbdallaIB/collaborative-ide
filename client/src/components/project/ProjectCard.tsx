import { IProject } from '@api/types';
import Modal from '@components/modal';
import DeleteProject from '@components/project/DeleteProject';
import Button from '@components/shared/button';
import useModal from '@lib/hooks/useModal';
import { docsDetails } from '@pages/code';
import { timeSinceDate } from '@utils/date';
import { useEffect, useState } from 'react';

type Content = {
  content: {
    language: string;
    contentLength: number;
  }[];
  totalContentLength: number;
};

interface Props {
  project: IProject;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
}

const ProjectCard = ({ project, openProject, deleteProject }: Props) => {
  const { isModalOpen, setIsModalOpen } = useModal();
  const { id, title, updatedAt } = project;
  const whenDidUpdate = timeSinceDate(updatedAt);
  const [content, setContent] = useState<Content>();

  useEffect(() => {
    const content = contentMakeUp();
    setContent(content);
  }, []);

  const contentMakeUp = (): Content => {
    const languages = ['js', 'html', 'css'];
    const content: { language: string; contentLength: number }[] = [];
    languages.forEach((language) => {
      let contentLength = 0;
      const languageContent = (project as any)[language];
      if (languageContent) {
        contentLength += languageContent.length;
      }
      content.push({ language, contentLength });
    });
    const totalContentLength = content.reduce((acc, curr) => acc + curr.contentLength, 0);
    return { content, totalContentLength };
  };

  return (
    <>
      <div className="rounded shadow-lg mx-auto relative w-full bg-main_side dark:bg-main_dark text-main_dark dark:text-main_side">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col items-center justify-around p-4 gap-5 h-full">
            <div className="text-2xl font-semibold text-center">{title}</div>
            <div className="flex flex-row gap-4 text-base">
              {content &&
                content.content.map(({ language, contentLength }) => {
                  const { color, name, icon } = docsDetails.filter((doc) => doc.name === language)[0];
                  const languagePercentage = Math.round((contentLength / content.totalContentLength) * 100);
                  return (
                    <div key={name} className="flex flex-col gap-3 items-center justify-between">
                      <i className={icon + ' text-3xl'} style={{ color }}></i>
                      <span className="text-sm">{languagePercentage || 0} %</span>
                    </div>
                  );
                })}
            </div>
            <div className="w-full flex justify-end gap-4 font-medium text-base mr-4 rounded-tl-sm">
              <div className="w-full flex flex-col gap-2 text-sm justify-start items-start ml-3">
                <span>Updated: </span>
                {whenDidUpdate} ago
              </div>
              <div className="flex items-end gap-2">
                <Button text={'Open'} onClick={() => openProject(id)} isPrimary></Button>
                <Button text={'Delete'} color="gray" onClick={() => setIsModalOpen(true)}></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        hasFooter={false}
        styles={{ content: { height: 'auto', width: 'auto' } }}
        isOpen={isModalOpen}
        title={''}
        cancel={() => {}}
        confirm={() => {}}
        confirmText="Upload"
      >
        <DeleteProject onCancel={() => setIsModalOpen(false)} onDelete={() => deleteProject(id)}></DeleteProject>
      </Modal>
    </>
  );
};

export default ProjectCard;
