import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';

import SearchResult from 'layout/search-result'
import axios from 'axios';
import config from 'config.json';

const search = function Search(){
    const [search, setSearch] = useState("");
    const [result, setResult] = useState([]);

    const location = useLocation();

    // effect는 mount 시 호출, unmount 시 return 함수 호출
    useEffect(()=>{
        
        const search = new URLSearchParams(location.search).get("search");

        const fetch = async ()=>{
            const response = await axios.get(config["blog-backend"]+"/api/blog/search", {
                params:{
                    search: search
                }
            });

            setSearch(search);
            setResult(response.data);
        }
        fetch();
    }, [location.search]);

    return(
        <>
        <form class="d-flex w-100 justify-content-center mt-5" role="search">
            <input class="form-control w-50 me-2" value={search} onChange={(e)=>{setSearch(e.target.value);}} type="search" placeholder="Search" aria-label="Search"/>
            <Link to={"/search/"+search}>
                <button class="btn btn-outline-success" type="button">Search</button>
            </Link>
        </form>
        <section className='mt-5'>
            {
                result.length === 0 ?
                <h2>검색 결과가 존재하지 않습니다.</h2>:
                result.map(item=>{return (<SearchResult item={item}/>)})
            }
        </section>
        </>
    )
}

export default search;