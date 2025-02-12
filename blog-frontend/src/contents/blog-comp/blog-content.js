import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';

import config from 'config.json';
import formatter from 'util/custom-formatter';
import refreshToken from 'util/token-refresh';

const blogContent = function BlogContent() {

    const loginId = useSelector(state => state.login.id);
    const access = useSelector(state => state.login.token);
    const isLogin = useSelector(state => state.login.isLogin);

    const location = useLocation();
    const navigate = useNavigate();

    const [createTime, setCreateTime] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [blogId, setBlogId] = useState("");

    const articleId = useRef();

    useEffect(()=>{

        const path = location.pathname.split("/");
        articleId.current = path[4];

        const fetch = async () => {
            const response = await axios.get(config["blog-backend"]+"/api/blog/article", {
                params:{
                    articleId: articleId.current
                }
            });

            setTitle(response.data.title);
            setCreateTime(formatter.ConvertArticleTime(response.data.create_time));
            const cleanContent = DOMPurify.sanitize(response.data.content);
            setContent(cleanContent);
            setCategory(response.data.category_name)
            setBlogId(response.data.id);
  
        }
        fetch();
    }, [location.pathname]);

    const deleteArticle = async ()=>{
        try {
            await refreshToken();
            await axios.delete(config['blog-backend']+"/api/write", {
                params:{
                    articleId: articleId.current
                },
                headers:{
                    Authorization: access
                }
            });

            alert("글이 삭제 되었습니다.");
            navigate(`/blog/${blogId}/list`);
        } catch {
            alert("글 삭제 중 오류가 발생했습니다.")
        }
    }

    return (
        <>
            <article className='p-3'>
                <h2>{title}</h2>
                <div className='d-flex justify-content-between'><span>{category}</span><span>{createTime}</span></div>
                {
                    blogId === loginId && isLogin ? <div className='text-end'><Link to={"/write/update/"+articleId.current}><button className='btn btn-success'>수정</button></Link><button className='btn btn-danger ms-2' onClick={()=>deleteArticle()}>삭제</button></div> : <></>
                }
                <hr />
                <div dangerouslySetInnerHTML={{__html:content}}>
                    
                </div>
            </article>
        </>
    )
}

export default blogContent;