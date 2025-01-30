import React from 'react';
import {Link} from 'react-router-dom';

const blogListOption = function blogListOption({item}){

    return(
        <>
            <li class="list-group-item d-flex justify-content-between">
                <Link to={item.link}><span>{item.title}</span></Link>
                <span>{item.createdDate}</span>
            </li>
        </>
    )
}

export default blogListOption;