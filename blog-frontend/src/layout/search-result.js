import React from 'react';
import { Link } from 'react-router-dom';

const searchResult = function SearchResult({ item }) {
    return (
        <div>
            <Link to={item.link}>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
            </Link>
        </div>
    )
}

export default searchResult;