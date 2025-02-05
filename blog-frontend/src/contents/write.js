import React, { useRef, useState } from 'react';
import Editor from 'layout/editor';
import Quill from 'quill';

const Delta = Quill.import('delta');

const blogWrite = function BlogWrite() {
    // Use a ref to access the quill instance directly
    const quillRef = useRef();

    const uploadArticle = ()=>{
        console.log(quillRef.current.getSemanticHTML());
    }

    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});

    return (
        <>
            <h1>글쓰기</h1>
            <hr />
            <h3>카테고리</h3>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {selectedCategory.name ? selectedCategory.name : "카테고리"}
                </button>
                <ul className="dropdown-menu">
                    {category.map(item=>{return (
                        <li className="dropdown-item" onClick={()=>setSelectedCategory(item)}>{item.name}</li>
                    )})}
                </ul>
            </div>
            <hr/>
            <Editor
                ref={quillRef}
            />
            <hr/>
            <button className='btn btn-primary w-100 mb-5' onClick={()=>uploadArticle()}>글쓰기</button>
        </>
    )
}

export default blogWrite;