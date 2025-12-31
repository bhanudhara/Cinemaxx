import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/login';
import SignIn from './components/signin';
import NotFoundPage from './components/NotFoundPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
