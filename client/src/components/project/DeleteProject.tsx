interface Props {
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteProject = ({ onDelete, onCancel }: Props) => {
  return (
    <div className="flex h-full w-full">
      <div className="relative w-full max-w-md h-full md:h-auto">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <i className="bx bx-error-circle text-6xl opacity-60 text-main_side"></i>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 mt-4">
            Are you sure you want to delete this project?
          </h3>
          <div className="flex flex-row items-center justify-between">
            <button
              onClick={onDelete}
              type="button"
              className="text-white bg-main focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Yes, I'm sure
            </button>
            <button
              onClick={onCancel}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-300 text-sm font-medium px-5 py-2.5 hover:text-main_side focus:z-10 dark:bg-main_dark dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
