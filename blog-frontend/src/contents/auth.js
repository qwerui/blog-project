import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export const Login = ({ show, close, toSignUp }) => {
    return (
        <Modal show={show} backdrop="static" centered>
            <Modal.Header closeButton onClick={close}>
                <Modal.Title>로그인</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="LoginId">
                        <Form.Label>아이디</Form.Label>
                        <Form.Control type="text" placeholder="Enter ID" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="LoginPassword">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={toSignUp}>
                    회원가입
                </Button>
                <Button variant="primary" onClick={close}>
                    로그인
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export const SignUp = ({ show, close, toLogin }) => {
    return (
        <Modal show={show} backdrop="static" centered>
            <Modal.Header closeButton onClick={toLogin}>
                <Modal.Title>회원가입</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="SignUpEmail">
                        <Form.Label>아이디</Form.Label>
                        <Form.Control type="text" placeholder="Enter ID" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="SignUpPassword">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="SignUpRepeatPassword">
                        <Form.Label>비밀번호 확인</Form.Label>
                        <Form.Control type="password" placeholder="Repeat Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="SignUpNickname">
                        <Form.Label>닉네임</Form.Label>
                        <Form.Control type="text" placeholder="Nickname" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={close}>
                    가입하기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
