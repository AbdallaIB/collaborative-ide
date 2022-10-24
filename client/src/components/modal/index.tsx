import './index.css';
import Modal from 'react-modal';
import { ReactNode } from 'react';
import Button from '@components/shared/button';

export interface Props {
  title: string;
  isOpen: boolean;
  children?: ReactNode;
  confirmText: string;
  styles: { content: { height: string; width: string } };
  hasFooter: boolean;
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

const Modals = ({ title, isOpen, children, cancel, confirm, confirmText, styles, hasFooter = true }: Props) => {
  return (
    <Modal
      style={{ content: { ...customStyles.content, ...styles.content, overflow: 'hidden' } }}
      ariaHideApp={false}
      contentLabel={title}
      isOpen={isOpen}
      //   toggle={() => cancel()}
    >
      <header className="header">
        <h2 className="font-medium"> {title} </h2>
        <button className="h-full text-2xl" onClick={() => cancel()}>
          <i className="bx bx-x"></i>
        </button>
      </header>
      <main
        className={'flex flex-col items-center justify-center w-full mt-4'}
        style={{ borderBottom: hasFooter ? '1px solid #dddddd' : '', height: '85%' }}
      >
        {children}
      </main>
      {hasFooter && (
        <footer className="footer">
          <Button text="Cancel" onClick={() => cancel()} color="gray"></Button>
          <Button text={confirmText} onClick={() => confirm()} isPrimary></Button>
        </footer>
      )}
    </Modal>
  );
};

export default Modals;
