import {Request, Response, Router} from "express";
import {randomUUID} from "node:crypto";
import {authMiddleware} from "@/middleware/authMiddleware";
import path from "node:path";
import {saveData} from "@/utils/auth";

const linkRouter = Router();

linkRouter.use(authMiddleware); // 권한 인증 미들웨어 추가

let links: Link[] = [];
const dataDir = path.join(__dirname, '../..', 'data')
const linksFilePath = path.join(dataDir, 'links.json')

/**
 * 링크 등록
 */
linkRouter.post('/link/add', (req: Request, res: Response)=>{
    const {url, title, memo = ""} = req.body ?? {};
    if(!url || !title) return res.status(400).json({message: "URL 또는 제목을 입력해주세요."})

    const userId = (req as any).userId; // Request 타입 확장을 했다면 req.userId로 바로 접근
    if(!userId) return res.status(400).json({message: "사용자가 존재하지 않습니다. "})

    const link: Link = {
        url,
        title,
        memo,
        userId,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    links.push(link);
    saveData<Link>(linksFilePath, links);

    res.status(200).json({link});
})

export default linkRouter;
