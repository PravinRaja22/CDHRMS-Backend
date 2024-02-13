import { leaveBalanceService } from "../../services/Hrms/leaveBalance.service.js"; 

export async function getLeaveBalanceByUsers(request : any , reply : any){
    try {
        let queryParams:any = request.params.userId
        let result = await leaveBalanceService.getLeaveBalanceByUsers(Number(queryParams))
        reply.send(result)
      } catch (error: any) {
        reply.status(500).send(error.message);
      }
}

export async function upsertLeaveBalanceByUsers(request:any,reply:any){
    try{
        let queryParams:any = request.params.userId
        let requestBody:any = request.body

        let result = await leaveBalanceService.upsertLeaveBalanceByUsers(queryParams,requestBody)
        reply.send(result)
    }catch(error:any){
        reply.status(500).send(error.message);
    }
}