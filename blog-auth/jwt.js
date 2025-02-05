import * as jose from 'jose';

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
        
        // Jwks 로테이션을 위한 코드
        if(this.jwks == null) {
            this.jwks = {keys:[publicJWK]};
            this.privateKey = [privateKey];
        }
        else {
            this.jwks = { keys: [publicJWK, this.jwks.keys[0]] };
            this.privateKey = [privateKey, this.privateKey[0]];
        }
    }

    async GenerateToken(payload, iss, aud) {
        this.VaildField();

        if(!this.privateKey) {
            throw new Error("Private Key Not Exists!");
        }

        const jwtPlan = new jose.SignJWT(payload)
        .setProtectedHeader({ alg: this.alg })
        .setIssuedAt()
        .setExpirationTime(this.exp);

        if(iss) {
            jwtPlan.setIssuer(this.iss);
        }

        if(aud) {
            jwtPlan.setAudience(this.aud);
        }
        
        const jwt = await jwtPlan.sign(this.privateKey);

        return jwt;
    }

    async ValidateToken(token) {
        const {payload, protectedHeader} = await jose.jwtVerify(token, jwks);
        return {payload: payload, protectedHeader: protectedHeader};
    }
}

