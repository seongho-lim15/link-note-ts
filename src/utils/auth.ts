import * as fs from "node:fs";

/**
 * T 타입 배열로 파일을 읽는 함수
 * @param filePath
 */
export const readData = <T>(filePath: string) : T[] =>{
    if(!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
}

/**
 * T 타입 데이터를 파일에 저장하는 함수
 * @param filePath
 * @param data
 */
export const saveData = <T>(filePath: string, data: T[]) : boolean =>{
    if(!fs.existsSync(filePath)) return false;

    fs.writeFileSync(filePath, JSON.stringify( data, null, 2), {encoding: 'utf-8', flag: 'w'})
    return true;
}