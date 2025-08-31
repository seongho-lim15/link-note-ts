import {Request, Response, Router} from "express";

const healthRouter = Router();

/**
 * 간단한 헬스 체크
 */
healthRouter.get("/health", (_req: Request, res: Response)=>{
    res.json({ok: true})
})

export default healthRouter;