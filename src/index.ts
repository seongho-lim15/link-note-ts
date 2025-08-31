import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import * as process from "node:process";
import healthRouter from "@/route/health";
import authRouter from "@/route/auth";
import linkRouter from "@/route/link";

// .env 로드
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// 라우트 설정
app.use(healthRouter)
app.use(authRouter)
app.use(linkRouter)

// 서버 시작
app.listen(PORT, ()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})
