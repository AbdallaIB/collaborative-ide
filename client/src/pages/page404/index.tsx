import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <div className="page-404">
      <p className="mt-5 mb-3 text-xl font-bold text-black md:text-2xl">Page not found (404)</p>
      <p className="mb-3 text-base font-medium text-main_side">
        The page you're looking for may have moved or no longer exists. Head back to our
        <Link to="/" className="underline">
          homepage
        </Link>
        , or take a look at one of the sections below.
      </p>
    </div>
  );
};

export default Page404;
