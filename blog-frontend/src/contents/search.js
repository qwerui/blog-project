import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import SearchResult from 'layout/search-result'

const search = function Search(){
    const [search, setSearch] = useState("");
    const [result, setResult] = useState([]);

    // effect는 mount 시 호출, unmount 시 return 함수 호출
    useEffect(()=>{
        // axios로 result 업데이트
        setResult([]);
    }, []);

    return(
        <>
        <form class="d-flex w-100 justify-content-center mt-5" role="search">
            <input class="form-control w-50 me-2" value={search} onChange={(e)=>{setSearch(e.target.value);}} type="search" placeholder="Search" aria-label="Search"/>
            <Link to={"/search/"+search}>
                <button class="btn btn-outline-success" type="button">Search</button>
            </Link>
        </form>
        <section className='mt-5'>
            {result.map(item=>{return (<SearchResult item={item}/>)})}
        </section>
        </>
    )
}

export default search;