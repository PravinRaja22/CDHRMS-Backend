
import { CacheStore } from "../helpers/CacheStore.js";

export const checkSessionID = async (sessionId)=>{
    console.log(sessionId);
    return new Promise((resolve,reject)=>{
        if(!sessionId)
            resolve(undefined)
        else{
            CacheStore.get(sessionId).then(
                (result)=>{
                    console.log(result);
                    resolve(result);
                },
                (error)=>{
                    resolve(undefined)
                }
            )
        }
        
    })
    
}