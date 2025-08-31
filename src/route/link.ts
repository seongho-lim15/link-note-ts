import {Request, Response, Router} from "express";

const linkRouter = Router();

/**
 * 링크 등록
 */
linkRouter.post('/link/add', (req: Request, res: Response)=>{
    const {url, title, memo = ""} = req.body ?? {};
    if(!url || !title) return res.status(400).json({message: "URL 또는 제목을 입력해주세요."})

    
})

export default linkRouter;