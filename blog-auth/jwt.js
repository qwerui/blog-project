import * as jose from 'jose';
import { v7 } from 'uuid';

export default class JwtService {
    alg = null;
    jwks = null;
    privateKey = null;
    exp = null;
    
    constructor(alg, exp) {
        this.alg = alg;
        this.exp = exp;
    }

    // 필드 필수 요소 체크
    VaildField() {
        let isValid = true;
        isValid |= this.alg;
        isValid |= this.exp;

        if(!isValid) {
            throw new Error("Jwt Service Field Not Valid");
        }
    }

    async GenerateJwks() {
        this.VaildField();

        const { publicKey, privateKey } = await jose.generateKeyPair(this.alg);

        const publicJWK = await jose.exportJWK(publicKey);
        const kid = v7();
        publicJWK.kid = kid;
        const privateKeyObj = {
            kid: kid,
            key: privateKey
        }
        
        // Jwks 로테이션을 위한 코드
        if(this.jwks == null) {
            this.jwks = {keys:[publicJWK]};
            this.privateKey = [privateKeyObj];
        }
        else {
            this.jwks = { keys: [publicJWK, this.jwks.keys[0]] };
            this.privateKey = [privateKeyObj, this.privateKey[0]];
        }
    }

    async GenerateToken(payload, iss, aud) {
        this.VaildField();

        if(!this.privateKey || this.privateKey.length == 0) {
            throw new Error("Private Key Not Exists!");
        }

        const jwtPlan = new jose.SignJWT(payload)
        .setProtectedHeader({ alg: this.alg, kid: this.privateKey[0].kid })
        .setIssuedAt()
        .setExpirationTime(this.exp);

        if(iss !== false) {
            jwtPlan.setIssuer(iss);
        }

        if(aud !== false) {
            jwtPlan.setAudience(aud);
        }
        
        const jwt = await jwtPlan.sign(this.privateKey[0].key);

        return jwt;
    }

    async ValidateToken(token) {
        const header = jose.decodeProtectedHeader(token);
        const privateKey = this.privateKey.find(item => item.kid === header.kid);
        const {payload, protectedHeader} = await jose.jwtVerify(token, privateKey.key);
        return {payload: payload, protectedHeader: protectedHeader};
    }
}

