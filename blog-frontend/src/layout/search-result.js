import React from 'react';
import { Link } from 'react-router-dom';
import formatter from 'util/custom-formatter';

const searchResult = function SearchResult({ item }) {
    return (
        <div>
            <Link to={`/blog/${item.id}/content/${item.article_id}`}>
                <div className='d-flex justify-content-between'>
                    <h3>{item.title}</h3>
                    <span>{formatter.ConvertArticleTime(item.create_time)}</span>
                </div>
            </Link>
        </div>
    )
}

export default searchResult;