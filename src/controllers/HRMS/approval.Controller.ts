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

export async function getApprovalsById(request:any,reply:any) {
   
    if (request.query) {
      try {
        console.log("if req query", request.query);
        let result = await approvalService.getApprovalsById(request.params.id);
        reply.send(result);
      } catch (error) {
        reply.status(500).send(error.message);
      }
    } else {
      try {
        console.log("********", request.params);
        let result = await approvalService.getApprovalsById(request.params.id);
        reply.send(result);
      } catch (error) {
        reply.status(500).send(error.message);
      }
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


