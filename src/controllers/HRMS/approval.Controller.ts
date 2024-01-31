import { approvalService } from "../../services/Hrms/approval.service.js";

export async function getAllApprovals(request:any,reply:any){
    try{
        let result = await approvalService.getAllApprovals()
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message);
    }
}

export async function insertApprovals(request:any,reply:any) {
    try{
        //let result = await approvalService.postApprovals(request.body)
        //reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}

export async function getApprovalbyApprover(request:any,reply:any) {
    try{
        let result = await approvalService.getApprovalbyApprover(request.params.approverId)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }    
}

export async function updateApprovals(request:any,reply:any){
    try{
        let result = await approvalService.updateApprovals(request.body,request.params.id)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}


