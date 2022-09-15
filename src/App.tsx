import React from 'react';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import Routes from './routes';

const App: React.FC = () => (
  <>
    <Routes />
    <ToastContainer position="top-right" autoClose={5000} />
  </>
);

export default App;
