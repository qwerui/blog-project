import React, {useState} from 'react';
import { Button, Form } from 'react-bootstrap';

const blogConfig = function BlogConfig() {

    const [inputCategory, setInputCategory] = useState("");
    const [category, setCategory] = useState([]);
    
    const addCategory = ()=>{
        if(inputCategory.length > 0) {
            setCategory([...category, inputCategory]);
            setInputCategory("");
        }
    }

    const removeCategory = (remove)=>{
        setCategory(category.filter(item=>item !== remove));
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