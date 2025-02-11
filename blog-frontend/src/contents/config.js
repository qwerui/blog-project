import React, {useState} from 'react';
import { Button, Form } from 'react-bootstrap';
<<<<<<< Updated upstream
=======
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import config from 'config.json';
import refreshToken from 'util/token-refresh';
>>>>>>> Stashed changes

const blogConfig = function BlogConfig() {

    const [inputCategory, setInputCategory] = useState("");
    const [category, setCategory] = useState([]);
<<<<<<< Updated upstream
    
    const addCategory = ()=>{
        if(inputCategory.length > 0) {
            setCategory([...category, inputCategory]);
=======
    const [newCategory, setNewCategory] = useState([]);
    const [deleteCategory, setDeleteCategory] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [before, setBefore] = useState({});

    const loginId = useSelector(state => state.login.id);
    const access = useSelector(state => state.login.token);

    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(config["blog-backend"] + "/api/config", {
                params: {
                    id: loginId,
                }
            });
            setBefore(response.data);
        }
        fetch();
    }, [loginId]);

    useEffect(()=>{
        setTitle(before.title);
        setDescription(before.description);
        setCategory(before.category ? before.category : []);
    }, [before])

    const updateConfig = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const blogImage = formData.get("image");

        refreshToken();
        
        try {
            await axios.put(config["blog-backend"] + "/api/config", {
                blogId: before.blog_id,
                title: title,
                description: description,
                image: blogImage,
                newCategory: newCategory,
                deleteCategory: deleteCategory
            }, 
            { 
                headers:{
                    "Content-Type": "multipart/form-data",
                    Authorization: access
                }
            }
        );

        alert("저장되었습니다.");
        navigate("/blog/index/"+loginId);

        } catch {
            alert("블로그 설정 중 오류가 발생했습니다.");
        }
    }

    const addCategory = () => {
        if(category.filter(item => item.name === inputCategory).length > 0){
            alert("이미 존재하는 카테고리입니다.");
            return;
        }
        if (inputCategory.length > 0) {
            setCategory([...category, {name:inputCategory}]);
            setNewCategory([...newCategory, inputCategory]);
>>>>>>> Stashed changes
            setInputCategory("");
        }
    }

<<<<<<< Updated upstream
    const removeCategory = (remove)=>{
        setCategory(category.filter(item=>item !== remove));
=======
    const removeCategory = (remove) => {
        setCategory(category.filter(item => item.name !== remove.name));

        if(remove.category_id != null){
            setDeleteCategory([...deleteCategory, remove.category_id]);
        }
>>>>>>> Stashed changes
    }

    return (
        <>
            <h2 className='mb-3'>블로그 설정</h2>
            <Form>
                <Form.Group className="mb-3" controlId="blogTitle">
                    <Form.Label>블로그 제목</Form.Label>
                    <Form.Control type="text" placeholder="제목을 입력해주세요" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="blogDescription">
                    <Form.Label>블로그 설명</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="블로그의 간단 설명" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="blogPicture">
                    <Form.Label>블로그 프로필 사진</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="blogCategory">
                    <Form.Label className='d-block'>블로그 카테고리</Form.Label>
                    <div className='d-flex'>
                        <Form.Control type="text" value={inputCategory} onChange={(e)=>setInputCategory(e.target.value)}/>
                        <Button style={{width:"100px"}} onClick={()=>addCategory()}>추가</Button>
                    </div>
                </Form.Group>
                <p>현재 목록</p>
                <ul class="list-group">
                    {category.map(item=>{return(
                    <li class="list-group-item d-flex justify-content-between">
                        <span className='fs-4'>{item}</span>
                        <button type="button" className="btn btn-danger" onClick={()=>removeCategory(item)}>삭제</button>
                    </li>
                )})}    
                </ul>
            </Form>
            <hr/>
            <Button className='w-100'>저장</Button>
        </>
    )
}

export default blogConfig;