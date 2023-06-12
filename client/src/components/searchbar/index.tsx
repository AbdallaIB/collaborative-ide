interface Props {
  value: string;
  placeholder: string;
  setValue: (value: string) => void;
}

const SearchBar = ({ value, setValue, placeholder }: Props) => {
  return (
    <div className="flex items-center justify-center w-full relative gap-4">
      <div className="relative">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <i className="bx bx-search-alt-2 text-gray-600 dark:text-main_side"></i>
        </div>
        <input
          id="table-search"
          className="block p-2 pl-10 w-80 text-sm text-main_dark bg-white rounded-lg border border-main focus:ring-main focus:border-main dark:bg-main_dark dark:border-main dark:placeholder-gray-400 dark:text-main_side dark:focus:ring-main dark:focus:border-main"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
