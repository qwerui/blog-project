import React, { useRef, useState } from 'react';
import Editor from 'layout/editor';
import Quill from 'quill';

const Delta = Quill.import('delta');

const blogWrite = function BlogWrite() {
    // Use a ref to access the quill instance directly
    const quillRef = useRef();

    const uploadArticle = () => {
        console.log(quillRef.current.getSemanticHTML());
    }

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});

    return (
        <>
            <h1>글쓰기</h1>
            <hr />
            <div className='d-flex justify-content-between'>
                <div className='d-flex'>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedCategory.name ? selectedCategory.name : "카테고리"}
                        </button>
                        <ul className="dropdown-menu">
                            {category.map(item => {
                                return (
                                    <li className="dropdown-item" onClick={() => setSelectedCategory(item)}>{item.name}</li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <button className='btn btn-primary' onClick={() => uploadArticle()}>글쓰기</button>
            </div>
            <div>
                제목<input className='form-control' value={title} onChange={(e)=>setTitle(e.target.value)}/>
            </div>

            <hr />
            <Editor
                ref={quillRef}
            />
        </>
    )
}

export default blogWrite;