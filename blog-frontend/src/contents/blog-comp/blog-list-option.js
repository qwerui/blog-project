import React from 'react';
import {Link} from 'react-router-dom';
import formatter from 'util/custom-formatter';

const blogListOption = function blogListOption({item, id}){

    return(
        <>
            <li class="list-group-item d-flex justify-content-between" key={item.article_id}>
                <Link to={"/blog/"+id+"/content/"+item.article_id}><span>{item.title}</span></Link>
                <span>{formatter.ConvertArticleTime(item.create_time)}</span>
            </li>
        </>
    )
}

export default blogListOption;