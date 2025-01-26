import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const Login = ({ show, close, toSignUp }) => {
    return (
        <Modal show={show} backdrop="static" centered>
            <Modal.Header closeButton onClick={close}>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={close}>
                    Login
                </Button>
                <Button variant="primary" onClick={toSignUp}>
                    Toggle
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export const SignUp = ({ show, close, toLogin }) => {
    return (
        <Modal show={show} backdrop="static" centered>
            <Modal.Header closeButton onClick={close}>
                <Modal.Title>SignUp</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={close}>
                    Login
                </Button>
                <Button variant="primary" onClick={toLogin}>
                    Toggle
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
