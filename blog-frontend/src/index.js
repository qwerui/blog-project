import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './layout/header';
import Footer from './layout/footer';
import Main from './layout/main';
import {Login, SignUp} from 'contents/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header/>
    <Main/>
    <Footer/>
    <Login/>
    <SignUp/>
  </React.StrictMode>
);