import Header from '@components/header';
import Routes from '@routes/Routes';
import { ToastContainer } from 'react-toastify';
import './App.css';

const App = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full bg-gray-50">
      <Header></Header>
      <Routes />
      <ToastContainer toastClassName="bg-main_white" pauseOnHover={false} />
    </div>
  );
};

export default App;
