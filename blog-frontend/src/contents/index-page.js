import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const indexPage = function IndexPage(){
    const [search, setSearch] = useState("");

    return(
        <>
        <h1 className="text-center mt-5">나만의 블로그 Bloggy</h1>
        <br/>
        <p className='text-center'>
           간단하게 만드는 블로그!
        </p>
        <br/>
        <h3 className='text-center mt-5'>찾고 있는 글이 있나요?</h3>
        <form class="d-flex w-100 justify-content-center" role="search">
            <input class="form-control w-50 me-2" value={search} onChange={(e)=>setSearch(e.target.value)} type="search" placeholder="Search" aria-label="Search"/>
            <Link to={"/search/"+search}>
                <button class="btn btn-outline-success" type="button">Search</button>
            </Link>
        </form>
        </>
    )
}

export default indexPage;