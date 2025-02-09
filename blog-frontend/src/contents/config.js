import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import config from 'config.json';
import refreshToken from 'util/token-refresh';

const blogConfig = function BlogConfig() {

    const [inputCategory, setInputCategory] = useState("");
    const [category, setCategory] = useState([]);
    const [newCategory, setNewCategory] = useState([]);
    const [deleteCategory, setDeleteCategory] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [before, setBefore] = useState({});

    const loginId = useSelector(state => state.login.id);
    const access = useSelector(state => state.login.token);

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(config["blog-backend"] + "/api/secure/config", {
                params: {
                    id: loginId,
                }
            });
            setBefore(response.data);

            setTitle(before.title);
            setDescription(before.description);
            setCategory(before.category ? before.category : []);
        }
        fetch();
    }, []);

    const updateConfig = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const blogImage = formData.get("image");

        console.log(blogImage);
        refreshToken();
        
        // try {
        //     await axios.put(config["blog-backend"] + "/api/secure/config", {
        //         id: loginId,
        //         title: title,
        //         description: description,
        //         newCategory: newCategory,
        //         deleteCategory: deleteCategory
        //     }, { withCredentials: true });
        // } catch {
        //     alert("블로그 설정 중 오류가 발생했습니다.");
        // }
    }

    const addCategory = () => {
        if(category.filter(item => item.name === inputCategory).length > 0){
            alert("이미 존재하는 카테고리입니다.");
            return;
        }
        if (inputCategory.length > 0) {
            setCategory([...category, {name:inputCategory}]);
            setNewCategory([...newCategory, inputCategory]);
            setInputCategory("");
        }
    }

    const removeCategory = (remove) => {
        setCategory(category.filter(item => item.name !== remove.name));
        if(remove.blog_id !== false){
            setDeleteCategory([...deleteCategory, remove.blog_id]);
        }
    }

    return (
        <>
            <h2 className='mb-3'>블로그 설정</h2>
            <Form onSubmit={updateConfig}>
                <Form.Group className="mb-3" controlId="blogTitle">
                    <Form.Label>블로그 제목</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="제목을 입력해주세요" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="blogDescription">
                    <Form.Label>블로그 설명</Form.Label>
                    <Form.Control as="textarea" value={description} onChange={(e)=>setDescription(e.target.value)} rows={3} placeholder="블로그의 간단 설명" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="blogPicture">
                    <Form.Label>블로그 프로필 사진</Form.Label>
                    <Form.Control accept='image/*' name="image" type="file" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="blogCategory">
                    <Form.Label className='d-block'>블로그 카테고리(카테고리 삭제 시 게시글은 전체글 보기에서만 열람이 가능합니다.)</Form.Label>
                    <div className='d-flex'>
                        <Form.Control type="text" value={inputCategory} onChange={(e) => setInputCategory(e.target.value)} />
                        <Button style={{ width: "100px" }} onClick={() => addCategory()}>추가</Button>
                    </div>
                </Form.Group>
                <p>현재 목록</p>
                <ul class="list-group">
                    {category.map((item, idx) => {
                        return (
                            <li class="list-group-item d-flex justify-content-between" key={idx}>
                                <span className='fs-4'>{item.name}</span>
                                <button type="button" className="btn btn-danger" onClick={() => removeCategory(item)}>삭제</button>
                            </li>
                        )
                    })}
                </ul>

                <hr />
                <Button className='w-100' type='submit'>저장</Button>
            </Form>
        </>
    )
}

export default blogConfig;