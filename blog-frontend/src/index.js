import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './layout/header';
import Footer from './layout/footer';
import Main from './layout/main';
import {Login, SignUp} from 'contents/auth';
import config from './config.json';
import store from './data/store'
import { Provider } from 'react-redux';

const {AUTH_BACKEND, BLOG_BACKEND} = process.env;

if(AUTH_BACKEND){
  config["auth-backend"] = AUTH_BACKEND;
}
if(BLOG_BACKEND){
  config["blog-backend"] = BLOG_BACKEND;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Header />
      <Main />
      <Footer />
      <Login />
      <SignUp />
    </React.StrictMode>
  </Provider>

);