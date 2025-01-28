import React from 'react';
import {Outlet} from 'react-router-dom';

import BlogNav from './blog-comp/blog-nav'

const blog = function Blog(){

    return(
        <>
            <BlogNav/>
            <section className='w-75 bg-secondary d-inline-block h-100'>
                <Outlet/>
            </section>
        </>
    )
}

export default blog;