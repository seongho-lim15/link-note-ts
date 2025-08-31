import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import * as process from "node:process";
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import e from "express";

// .env 로드
dotenv.config();

const users : User[]  = [
    {email: 'hws0602@naver.com', id: 'seonghoJJang123', passwordHash:"$2b$10$PzUg5hRQIybKvSg83nziZuIuUWfZf/zcA4wsIE8qCwTbvr4PP.ykK"}
]
const links: Link[] = [];
const JWT_SECRET = process.env.JWT_SECRET
if(!JWT_SECRET){
    console.error('환경변수 JWT_SECRET 를 설정하세요.')
    process.exit(1)
}

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * 간단한 헬스 체크
 */
app.get("/health", (_req: Request, res: Response)=>{
    res.json({ok: true})
})

/**
 * 회원가입
 */
app.post('/auth/signup',async (req: Request, res: Response)=>{
    const {email, password } = req.body ?? {};
    // 이메일이나 비밀번호가 존재하지 않을 때
    if(!email || !password) res.status(400).json({message: 'email 또는 비밀번호를 입력해주세요.'})

    // 이미 회원가입된 아이디인지 확인
    const exists = users.find(user => user.email === email)
    if(exists) return res.status(409).json({message: '이미 사용중인 이메일입니다..'})

    // 비밀번호 암호화
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('passwordHash : ', passwordHash)
    const user: User = {id : randomUUID(), email, passwordHash}
    users.push(user)
    
    return res.status(201).json({id: user.id, email: user.email})
})


app.listen(PORT, ()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})
