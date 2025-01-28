import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import 'css/main.css';

import IndexPage from 'contents/index-page';
import Search from 'contents/search';
import Blog from 'contents/blog';

import BlogList from 'contents/blog-comp/blog-list';
import BlogContent from 'contents/blog-comp/blog-content';

import NotFound from './not-found';

const main = function Main(){
    return(
        <main className="container">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<IndexPage/>}/>
                    <Route path='/search/*' element={<Search/>}/>
                    <Route path='/blog' element={<Blog/>}>
                        <Route path='list/*' element={<BlogList/>}/>
                        <Route path='content/*' element={<BlogContent/>}/>
                        <Route index element={<Navigate to='/nopage'/>}/>
                    </Route>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </main>
    )
}

export default main;