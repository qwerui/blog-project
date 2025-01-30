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

    return (
        <>
            <h1>글쓰기</h1>
            <hr />
            <Editor
                ref={quillRef}
            />
            <hr/>
            <button className='btn btn-primary w-100 mb-5' onClick={()=>uploadArticle()}>글쓰기</button>
        </>
    )
}

export default blogWrite;