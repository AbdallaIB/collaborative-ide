import Modal from 'react-modal';
import { ReactNode } from 'react';
import Button from '@components/shared/button';
import './index.css';
import useDarkModeStore from '@lib/stores/darkMode';

export interface Props {
  title: string;
  isOpen: boolean;
  children?: ReactNode;
  confirmText: string;
  styles: { content: { height: string; width: string } };
  hasFooter: boolean;
  isCancellable?: boolean;
  cancel: () => void;
  confirm: () => void;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Modals = ({
  title,
  isOpen,
  children,
  cancel,
  confirm,
  confirmText,
  styles,
  hasFooter = true,
  isCancellable = true,
}: Props) => {
  const { darkMode } = useDarkModeStore();
  return (
    <Modal
      style={{
        content: {
          ...customStyles.content,
          ...styles.content,
          overflow: 'hidden',
          padding: '0px',
          background: 'transparent',
        },
      }}
      ariaHideApp={false}
      contentLabel={title}
      isOpen={isOpen}
    >
      <section className={'modal ' + (darkMode ? 'dark' : '')}>
        <aside className="bg-main_side dark:bg-main_black p-5 rounded-lg">
          <header className="header bg-main_side dark:bg-main_black">
            <h2 className="font-medium text-main"> {title} </h2>
            {isCancellable && (
              <button className="h-full text-2xl" onClick={cancel}>
                <i className="bx bx-x text-main_dark dark:text-main_side"></i>
              </button>
            )}
          </header>
          <main
            className={'flex flex-col items-center justify-center w-full mt-4 bg-main_side dark:bg-main_black'}
            style={{ borderBottom: hasFooter ? '1px solid #dddddd' : '', height: '85%' }}
          >
            {children}
          </main>
          {hasFooter && (
            <footer className="footer bg-main_side dark:bg-main_black">
              {isCancellable && <Button text="Cancel" onClick={cancel} color="gray"></Button>}
              <Button text={confirmText} onClick={confirm} isPrimary></Button>
            </footer>
          )}
        </aside>
      </section>
    </Modal>
  );
};

export default Modals;
