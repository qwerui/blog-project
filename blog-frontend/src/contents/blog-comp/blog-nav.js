import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import config from 'config.json';

const blogNav = function BlogNav() {

    const location = useLocation();

    const id = useRef();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState([]);
    const [profile, setProfile] = useState("");
    const [nickName, setNickname] = useState("");
    const [description, setDescription] = useState("");

    useEffect(()=>{
        const path = location.pathname.split("/");

        id.current = path[2];

        const fetch = async () => {
            const response = await axios.get(config["blog-backend"]+"/api/blog/info", {
                params:{
                    id: id.current
                }
            });

            setTitle(response.data.title ?? response.data.nickname+"의 블로그");
            setProfile(response.data.image !== null ? config["blog-backend"]+response.data.image : "/logo512.png");
            setNickname(response.data.nickname);
            setDescription(response.data.description ?? response.data.nickname+"의 블로그입니다.");
            setCategory(response.data.category);
        }
        fetch();
    }, [location.pathname]);

    return (
        <>
            <aside className='w-25 d-inline-block h-100 p-3'>
                <div id="blog-title" className='border mb-2'>
                    <h5 className='text-center'>{title}</h5>
                </div>
                <div id="blog-profile-image" className='d-flex justify-content-center'>
                    <img className='border border-3' style={{height: "200px", width: "200px"}} src={profile} alt='profile'/>
                </div>
                <div id="blog-owner-description" className='border mt-1'>
                    <h5 className="text-center mt-2">{nickName}</h5>
                    <hr/>
                    <p className='ps-2 pe-2'>{description}</p>
                </div>
                <ul className="list-group mt-2">
                    <li className="list-group-item fw-bold">카테고리</li>
                    <li className="list-group-item"><Link to={{pathname:id.current+"/list"}}>전체글보기</Link></li>
                    {category.map(item=><li className="list-group-item" key={item.category_id}><Link to={{pathname:id.current+"/list", search:"?category="+item.category_id+"&name="+item.name}}>{item.name}</Link></li>)}
                </ul>
            </aside>
        </>
    )
}

export default blogNav;