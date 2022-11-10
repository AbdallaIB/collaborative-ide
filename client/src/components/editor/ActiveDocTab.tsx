import { Doc } from '@pages/code';

interface Props {
  selectedDoc: Doc;
}

const ActiveDocTab = ({ selectedDoc }: Props) => {
  const { icon, name, color } = selectedDoc;
  return (
    <div className="hover:opacity-90 hover:text-main_side text-sm flex items-center justify-center gap-2 text-white bg-main_dark px-3 py-1.5">
      <i className={icon + ' text-xl'} style={{ color }}></i>
      {'index.' + name}
    </div>
  );
};

export default ActiveDocTab;
