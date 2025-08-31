import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import * as process from "node:process";
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import * as path from "node:path";
import * as fs from "node:fs";

// .env 로드
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET
if(!JWT_SECRET){
    console.error('환경변수 JWT_SECRET 를 설정하세요.')
    process.exit(1)
}

let users : User[]  = []
const links: Link[] = [];

const dataDir = path.join(__dirname, '..', 'data')
const linksFilePath = path.join(dataDir, 'links.json')
const usersFilePath = path.join(dataDir, 'users.json')

const app: Express = express();
const PORT = process.env.PORT || 3000;

/**
 * T 타입 배열로 파일을 읽는 함수
 * @param filePath
 */
const readData = <T>(filePath: string) : T[] =>{
    if(!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
}

/**
 * T 타입 데이터를 파일에 저장하는 함수
 * @param filePath
 * @param data
 */
const saveData = <T>(filePath: string, data: T[]) : boolean =>{
    if(!fs.existsSync(filePath)) return false;

    fs.writeFileSync(filePath, JSON.stringify( data, null, 2), {encoding: 'utf-8', flag: 'w'})
    return true;
}

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
    users = readData(usersFilePath) // 파일에서 사용자 데이터 조회
    console.log('users: ', users)

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

    saveData<User>(usersFilePath, users) // 사용자 파일에 저장

    return res.status(201).json({id: user.id, email: user.email})
})


app.listen(PORT, ()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})
