import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import 'css/main.css';

import IndexPage from 'contents/index-page';
import Search from 'contents/search';
import Blog from 'contents/blog';

import BlogList from 'contents/blog-comp/blog-list';
import BlogContent from 'contents/blog-comp/blog-content';
import BlogIndex from 'contents/blog-comp/blog-index';
import Config from 'contents/config';
import Write from 'contents/write';

import NotFound from './not-found';

const main = function Main() {
    return (
        <main className="container">

            <Routes>
                <Route path='/' element={<IndexPage />} />
                <Route path='/search/*' element={<Search />} />
                <Route path='/blog' element={<Blog />}>
                    <Route path='index/*' element={<BlogIndex/>}/>
                    <Route path='list/*' element={<BlogList />} />
                    <Route path='content/*' element={<BlogContent />} />
                    <Route index element={<Navigate to='/nopage' />} />
                </Route>
                <Route path='/config/*' element={<Config />} />
                <Route path='/write/*' element={<Write />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

        </main>
    )
}

export default main;