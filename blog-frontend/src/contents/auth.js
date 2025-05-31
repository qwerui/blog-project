import React, {useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import config from 'config.json';
import { login } from 'data/login-store';

export const Login = ({ show, close, toSignUp }) => {
    const [validated, setValidated] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      if (form.checkValidity() === false) {
        event.stopPropagation();
        return;
      }

      setValidated(true);

      const formData = new FormData(form);

      try {
        const response = await axios.post(config["auth-backend"]+"/auth/login",{
            id: formData.get("id"),
            password: formData.get("password"),
        }, {withCredentials:true});
        
        dispatch(login({
            token: response.data,
            id: formData.get("id")
        }));
      }catch(err){
        console.log(err);
        alert("로그인 실패");
        return;
      }
      close();
    };

    return (
        <Modal show={show} backdrop="static" centered>
            <Form validated={validated} onSubmit={handleSubmit}>
            <Modal.Header closeButton onClick={close}>
                <Modal.Title>로그인</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                    <Form.Group className="mb-3" controlId="LoginId">
                    <Form.Label>아이디</Form.Label>
                        <Form.Control name='id' type="text" placeholder="Enter ID" required />
                        <Form.Control.Feedback type="invalid">
                            아이디를 입력해주세요
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="LoginPassword">
                    <Form.Label>비밀번호</Form.Label>
                        <Form.Control name='password' type="password" placeholder="Password" required />
                        <Form.Control.Feedback type="invalid">
                            비밀번호를 입력해주세요
                        </Form.Control.Feedback>
                    </Form.Group>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={toSignUp}>
                    회원가입
                </Button>
                <Button variant="primary" type='submit'>
                    로그인
                </Button>
            </Modal.Footer>
            </Form>
        </Modal>
    )
}
export const SignUp = ({ show, close, toLogin }) => {

    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");

    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      if (form.checkValidity() === false) {
        event.stopPropagation();
        return;
      }

      setValidated(true);

      const formData = new FormData(form);
      const idCheckRes = await axios.get(config["auth-backend"]+"/auth/check-id", {
        params:{
            id: formData.get("id")
        }
      });

      if(idCheckRes.data !== "Not Exist"){
        alert("중복된 ID입니다.");
        return;
      }

      try {
        await axios.post(config["auth-backend"]+"/auth/signup", {
            id: formData.get("id"),
            password: formData.get("password"),
            nickname: formData.get("nickname")
          });
      } catch(err){
        console.log(err);
        alert("잘못된 요청입니다.");
        return;
      }

      alert("회원가입 되었습니다.");
      setPassword("");
      setRepeat("");
      close();
    };

    return (
            <Modal show={show} backdrop="static" centered>
                <Form validated={validated} onSubmit={handleSubmit}>
                <Modal.Header closeButton onClick={toLogin}>
                    <Modal.Title>회원가입</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form.Group className="mb-3" controlId="SignUpEmail">
                        <Form.Label>아이디</Form.Label>
                        <Form.Control name='id' type="text" placeholder="Enter ID" required />
                        <Form.Control.Feedback type="invalid">
                            아이디를 입력해주세요
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="SignUpPassword">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control name='password' type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required />
                        <Form.Control.Feedback type="invalid">
                            비밀번호를 입력해주세요
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="SignUpRepeatPassword">
                        <Form.Label>비밀번호 확인</Form.Label>
                        <Form.Control type="password" placeholder="Repeat Password" onChange={(e)=>setRepeat(e.target.value)} isInvalid={repeat!==password} required/>
                        <Form.Control.Feedback type="invalid">
                            입력이 비밀번호와 동일해야합니다
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="SignUpNickname">
                        <Form.Label>닉네임</Form.Label>
                        <Form.Control name='nickname' type="text" placeholder="Nickname" required/>
                        <Form.Control.Feedback type="invalid">
                            닉네임을 입력해주세요
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        가입하기
                    </Button>
                </Modal.Footer>
                </Form>
            </Modal>
    )
}
