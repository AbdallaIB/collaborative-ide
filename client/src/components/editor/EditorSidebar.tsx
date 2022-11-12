import { Doc, EditorDoc } from '@pages/code';
import { useEffect, useState } from 'react';

interface Props {
  docs: Doc[];
  selectedDoc: EditorDoc;
  onDocSelect: (doc: EditorDoc) => void;
}

const EditorSidebar = ({ docs, onDocSelect, selectedDoc }: Props) => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const button = document.getElementById('doc-button-js');
      if (button) button.click();
    }, 1000);
  }, []);

  return (
    <div
      className={
        'flex h-full flex-col justify-between border-b bg-main_black text-gray-200 ' + (showSidebar ? 'w-40' : 'w-16')
      }
    >
      <div className={showSidebar ? 'px-4' : 'flex flex-col w-16 items-center justify-center'}>
        <div className="flex justify-center w-10 py-1.5 rounded-lg border-main_dark">
          <span className="text-sm font-medium"> Files </span>
        </div>

        <div className="flex flex-col space-y-1 gap-1 border-t border-main_dark">
          <div className="flex flex-col">
            {docs.map((doc, index) => (
              <button
                id={'doc-button-' + doc.name}
                key={index}
                onClick={() => onDocSelect(doc.name)}
                className={
                  (selectedDoc === doc.name ? 'bg-main_dark text-main_side' : '') +
                  ' text-main_side hover:bg-main_dark hover:text-main_side px-4 py-2 text-sm relative h-8 rounded mt-1'
                }
              >
                <div
                  className=" flex items-center justify-center gap-1 absolute"
                  style={{
                    left: '15%',
                    top: '0.15rem',
                  }}
                >
                  <i className={doc.icon + ' text-xl'} style={{ color: doc.color }}></i>
                  {showSidebar && 'index.' + doc.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-main_dark">
        <div className="flex justify-center p-1 rounded-lg">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex group items-center rounded-lg hover:bg-main_dark px-4 py-2 text-gray-200"
          >
            <i
              className={(showSidebar ? 'bx bx-arrow-from-right' : 'bx bx-arrow-from-left') + ' opacity-75 text-xl'}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
