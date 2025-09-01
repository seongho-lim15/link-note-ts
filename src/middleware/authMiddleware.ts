import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@/config/env";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization') ?? '';

    if(!token) return res.status(401).json({message: "토큰이 필요합니다.  "})

    try{
        const payload = jwt.verify(token, JWT_SECRET);
        console.log('payload: ', payload);

        (req as any).userId = payload.sub;
        next();
    }catch (e){
        return res.status(401).json({message: '유효하지 않은 토큰 입니다.'})
    }
}
