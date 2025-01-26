import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './layout/header';
import Footer from './layout/footer';
import Main from './layout/main';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header/>
    <Main/>
    <Footer/>
  </React.StrictMode>
);