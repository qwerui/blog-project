import React, { useRef, useState, useEffect } from 'react';
import Editor from 'layout/editor';
import Quill from 'quill';
import { useSelector } from 'react-redux';
import config from 'config.json';
import axios from 'axios';
import refreshToken from 'util/token-refresh';
import { useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from "dompurify";

const Delta = Quill.import('delta');

const blogWrite = function BlogWrite() {
    // Use a ref to access the quill instance directly
    const quillRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();

    const loginId = useSelector(state => state.login.id);
    const access = useSelector(state => state.login.token);

    const blogId = useRef();
    const articleId = useRef();
    const updateMode = useRef(false);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(-1);

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(config["blog-backend"] + "/api/write/category", {
                params: {
                    id: loginId,
                }
            });

            blogId.current = response.data.blogId;
            setCategory(response.data.category);
        }
        fetch();

        const path = location.pathname.split("/");
        if (path[2] === "update") {
            articleId.current = path[3];
            const initForUpdate = async () => {
                const response = await axios.get(config["blog-backend"] + "/api/blog/article", {
                    params: {
                        articleId: articleId.current
                    }
                });

                setTitle(response.data.title);
                setSelectedCategory(response.data.category_id);
                const cleanContent = DOMPurify.sanitize(response.data.content);
                quillRef.current.clipboard.dangerouslyPasteHTML(cleanContent);

            }
            initForUpdate();
            updateMode.current = true;
        }
    }, [loginId, location.pathname]);

    const uploadImage = (delta, oldDelta, source) => {
        delta.ops.forEach(async op => {
            if (op.insert && op.insert.image) {
                if (source === 'user') {
                    await refreshToken();
                    const file = base64ToFile(op.insert.image, "imagefile");

                    try {
                        const response = await axios.post(config["blog-backend"] + "/api/write/image", {
                            image: file
                        }, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: access
                            }
                        });

                        quillRef.current.updateContents(
                            new Delta()
                                .retain(quillRef.current.getLength() - 2)
                                .delete(1)
                                .insert({ image: config['blog-backend'] + "/" + response.data }));
                    } catch {
                        alert("이미지 삽입 중 오류 발생");
                        // 이미지 삽입 취소
                        quillRef.current.setContents(oldDelta);
                    }
                }
            }
        });
    }

    function base64ToFile(base64String, fileName) {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1]; // MIME 타입 추출
        const bstr = atob(arr[1]); // Base64 디코딩
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, { type: mime });
    }

    const uploadArticle = () => {
        if (selectedCategory == null) {
            alert("카테고리를 설정해주세요");
            return;
        }

        if (title.length === 0) {
            alert("제목을 입력해주세요");
            return;
        }

        if (updateMode.current === true) {
            updateArticle();
        } else {
            createArticle();
        }
    }

    const updateArticle = async () => {
        try {
            await refreshToken();
            const cleanContent = DOMPurify.sanitize(quillRef.current.getSemanticHTML());
            await axios.put(config["blog-backend"] + "/api/write", {
                articleId: articleId.current,
                title: title,
                category: selectedCategory,
                content: cleanContent
            }, {
                headers:{
                    Authorization: access
                }
            });

            alert("수정 되었습니다.");
            navigate("/blog/"+loginId+"/content/"+articleId.current);
        } catch {
            alert("글수정 중 오류가 발생했습니다.");
        }
    }

    const createArticle = async () => {
        try {
            await refreshToken();
            const cleanContent = DOMPurify.sanitize(quillRef.current.getSemanticHTML());
            await axios.post(config["blog-backend"] + "/api/write", {
                blogId: blogId.current,
                title: title,
                category: selectedCategory,
                content: cleanContent
            }, {
                headers:{
                    Authorization: access
                }
            });

            alert("작성되었습니다.");
            navigate("/blog/"+loginId+"/list");
        } catch {
            alert("글쓰기 중 오류가 발생했습니다.");
        }
    }

    return (
        <>
            <h1>{updateMode.current === true ? "글 수정" : "글쓰기"}</h1>
            <hr />
            <div className='d-flex justify-content-between'>
                <div className='d-flex'>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedCategory!==-1 ? category.find(item => item.category_id === selectedCategory).name : "카테고리"}
                        </button>
                        <ul className="dropdown-menu">
                            {category.map((item, idx) => {
                                return (
                                    <li className="dropdown-item" key={idx} onClick={() => setSelectedCategory(item.category_id)}>{item.name}</li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <button className='btn btn-primary' onClick={() => uploadArticle()}>{updateMode.current === true ? "글 수정" : "글쓰기"}</button>
            </div>
            <div>
                제목<input className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <hr />
            <Editor
                ref={quillRef}
                onTextChange={uploadImage}
            />
        </>
    )
}

export default blogWrite;