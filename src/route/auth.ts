import {Request, Response, Router} from "express";
import path from "node:path";
import {readData, saveData} from "@/utils/auth";
import {randomUUID} from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "@/config/env";

const authRouter = Router();

let users : User[]  = []
let links: Link[] = [];

const dataDir = path.join(__dirname, '../..', 'data')
const linksFilePath = path.join(dataDir, 'links.json')
const usersFilePath = path.join(dataDir, 'users.json')

/**
 * 회원가입
 */
authRouter.post('/auth/signup',async (req: Request, res: Response)=>{
    const {email, password } = req.body ?? {};

    users = readData<User>(usersFilePath) // 파일에서 사용자 데이터 조회
    console.log('users: ', users)
    // 이메일이나 비밀번호가 존재하지 않을 때
    if(!email || !password) res.status(400).json({message: 'email 또는 비밀번호를 입력해주세요.'})

    // 이미 회원가입된 아이디인지 확인
    const exists = users.find(user => user.email === email)
    if(exists) return res.status(409).json({message: '이미 사용중인 이메일입니다..'})

    // 비밀번호 암호화
    const passwordHash = await bcrypt.hash(password, 10);

    const user: User = {id : randomUUID(), email, passwordHash}
    users.push(user)

    saveData<User>(usersFilePath, users) // 사용자 파일에 저장

    return res.status(201).json({id: user.id, email: user.email})
})

/**
 * 로그인
 */
authRouter.post('/auth/login', async (req: Request, res:Response   )=>{
    const {email, password} = req.body ?? {};

    if(!email || !password) res.status(400).json({message: 'email 또는 비밀번호를 입력해주세요.'})

    users = readData<User>(usersFilePath) // 파일에서 사용자 데이터 조회

    const user = users.find(user => user.email === email);
    if(!user) return res.status(401).json({message: "회원가입된 사용자가 아닙니다."})

    const ok = await bcrypt.compare(password, user.passwordHash)
    if(!ok) return res.status(401).json({message: "이메일 또는 비밀번호가 일치하지 않습니다."})

    const token = jwt.sign({userId: user.id}, JWT_SECRET!, {expiresIn: '7d'})
    res.status(200).json({token})
})

export default authRouter;