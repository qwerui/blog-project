import React from 'react';
import { Outlet } from 'react-router-dom';

import BlogNav from './blog-comp/blog-nav'

const blog = function Blog() {

    return (
        <>
            <div id="blog-wrapper" className='h-100 d-flex'>
                <BlogNav />
                <section className='w-75 bg-secondary d-inline-block h-100'>
                    <Outlet />
                </section>
            </div>
        </>
    )
}

export default blog;