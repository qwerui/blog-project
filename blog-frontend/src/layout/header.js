import React, {useState} from 'react';
import {Login, SignUp} from 'contents/auth';

import 'css/header.css';

const header = function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const toggleLoginAndSignUp = (showSignUp)=>{
        setShowSignUp(showSignUp);
        setShowLogin(!showSignUp)
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg h-100">
                <div className="container-fluid">
                    <a className="navbar-brand fs-2" href="/">Bloggy</a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/blog">My Blog</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/config">Config</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/write">Write</a>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <button className="btn btn-success" type="button" onClick={()=>setShowLogin(true)}>로그인</button>
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