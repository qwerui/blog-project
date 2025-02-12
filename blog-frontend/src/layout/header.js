import React, {useState} from 'react';
import {Login, SignUp} from 'contents/auth';
import { Link } from 'react-router-dom';
import { logout } from 'data/login-store';
import config from 'config.json';
import 'css/header.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import refreshToken from 'util/token-refresh';

const header = function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const isLogin = useSelector(state => state.login.isLogin);
    const loginId = useSelector(state => state.login.id);
    const access = useSelector(state => state.login.token);

    const dispatch = useDispatch();

    const requestLogout = async () => {
        try {
            await refreshToken();
            await axios.delete(config['auth-backend']+"/auth/logout", {
                params:{
                    id: loginId
                },
                headers: {
                    Authorization: access
                }
            });
            dispatch(logout());
        } catch {
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    }

    const toggleLoginAndSignUp = (showSignUp)=>{
        setShowSignUp(showSignUp);
        setShowLogin(!showSignUp)
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg h-100">
                <div className="container-fluid">
                    <Link className="navbar-brand fs-2" to="/">Bloggy</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            {
                                isLogin ? <>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to={"/blog/"+loginId+"/list"}>My Blog</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to={"/config/"+loginId}>Config</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to={"/write/"+loginId}>Write</Link>
                                </li>
                                </>:<></>
                            }
                        </ul>
                        <form className="d-flex">
                            {
                                isLogin ?
                                <button className="btn btn-success" type="button" onClick={()=>requestLogout()}>로그아웃</button>
                                :
                                <button className="btn btn-success" type="button" onClick={()=>setShowLogin(true)}>로그인</button>
                            }
                           
                        </form>
                    </div>
                </div>
            </nav>
            <Login show={showLogin} close={()=>setShowLogin(false)} toSignUp={()=>toggleLoginAndSignUp(true)}/>
            <SignUp show={showSignUp} close={()=>setShowSignUp(false)} toLogin={()=>toggleLoginAndSignUp(false)}/>
        </header>
    )
}

export default header;