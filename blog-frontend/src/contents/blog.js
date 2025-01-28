import React from 'react';
import {Outlet} from 'react-router-dom';

import BlogNav from './blog-comp/blog-nav'

const blog = function Blog(){

    return(
        <>
            <BlogNav/>
            <Outlet/>
        </>
    )
}

export default blog;