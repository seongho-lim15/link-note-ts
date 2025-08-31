import * as process from "node:process";
import 'dotenv/config';

export const JWT_SECRET: string = (()=>{
    const v = process.env.JWT_SECRET
    if(!v){
        throw new Error("환경변수 JWT_SECRET 가 설정 되지 않습니다.")
    }
    return v;
})();