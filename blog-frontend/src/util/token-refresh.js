import axios from "axios";
import store from "data/store";
import { refresh, logout } from "data/login-store";
import { jwtDecode } from "jwt-decode";
import config from 'config.json';

const refreshToken = async () => {

    const state = store.getState();
    const access = state.login.token;
    const isLogin = state.login.isLogin;
    const loginId = state.login.id;

    if(!isLogin){
        return;
    }
    
    try {
        const { exp } = jwtDecode(access);
        
        if (exp < Math.floor(Date.now() / 1000)){
            const newToken = await axios.post(config["auth-backend"]+"/auth/refresh",{id:loginId},{withCredentials: true});
            store.dispatch(refresh(newToken.data));
        }
    } catch (error) {
        console.error("Token refresh error : ", error);
        store.dispatch(logout());
        alert("부적절한 이용이 감지되었습니다. 다시 로그인 해주세요");
        window.location.href = "/";
        return;
    }
}

export default refreshToken;