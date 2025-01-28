import React, { useState } from 'react';

const blogNav = function BlogNav() {

    const [category, setCategory] = useState([]);
    const [profile, setProfile] = useState("");

    return (
        <>
            <aside className='w-25 d-inline-block h-100 p-3'>
                <div id="blog-profile-image" className='d-flex justify-content-center'>
                    <img className='border border-3' style={{height: "200px", width: "200px"}} src={profile ? profile : "/logo512.png"} alt='profile'/>
                </div>
                <div id="blog-owner-description" className='border mt-1'>
                    <h5 className="text-center mt-2">블로그 주인장</h5>
                    <hr/>
                    <p className='ps-2 pe-2'>여기에 간단한 자기소개가 나옵니다.</p>
                </div>
                <ul className="list-group mt-2">
                    <li className="list-group-item fw-bold">카테고리</li>
                    {category.map(item=><li className="list-group-item">{item}</li>)}
                </ul>
            </aside>
        </>
    )
}

export default blogNav;