import { approvalService } from "../../services/Hrms/approval.service.js";
import { userService } from "../../services/Hrms/user.service.js";

export async function getAllApprovals(request: any, reply: any) {
    try {
        let result = await approvalService.getAllApprovals();
        reply.send(result);
    } catch (error) {
        reply.status(500).send(error.message);
    }
}

export async function insertApprovals(request: any, reply: any) {
    try {
        //let result = await approvalService.postApprovals(request.body)
        //reply.send(result)
    } catch (error) {
        reply.status(500).send(error.message);
    }
}

export async function getApprovalsById(request: any, reply: any) {
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
export async function getApprovalbyApprover(request: any, reply: any) {
    console.log(request.query, "req query");
    if (Object.keys(request.query).length > 0) {
        console.log("else testquery pending");
        if (request.query?.type.includes("leave")) {
            console.log("if approval leave req");
            try {
                let result = await approvalService.getApprovalsByApproverLeaveQuery(
                    request.params.approverId,
                    request.query
                );
                reply.send(result);
            } catch (error: any) {
                reply.status(500).send(error.message);
            }
        } else if (request.query?.type.includes("attendance")) {
            console.log("else approval attendancereqularize req");
            try {
                let result = await approvalService.getApprovalsByApproverAttendanceQuery(
                    request.params.approverId,
                    request.query
                );
                reply.send(result);
            } catch (error: any) {
                reply.status(500).send(error.message);
            }
        }
    } else {
        try {
            let result = await approvalService.getApprovalbyApprover(
                request.params.approverId
            );
            reply.send(result);
        } catch (error) {
            reply.status(500).send(error.message);
        }
    }
}


export async function getApprovalbySuperAdmin(request: any, reply: any) {
    console.log(request.query, "req query getApprovalbySuperAdmin");
    
    let superAdminRecord = await userService.checkSuperAdminUser(request.params.superadminId)
    console.log(superAdminRecord,"superAdminRecord")
    
        if(superAdminRecord.id ===Number(request.params.superadminId)){
            console.log("inside if")
         let result = await callSuperAdmin(request,reply)
         console.log(result,"call superadmin result")
        }else{
            console.log("inside else")
        }
    }


export async function updateApprovals(request: any, reply: any) {
    try {
        let result = await approvalService.updateApprovals(
            request.body,
            request.params.id
        );
        reply.send(result);
    } catch (error) {
        reply.status(500).send(error.message);
    }
}


const callSuperAdmin =async(request,reply)=>{
    if (Object.keys(request.query).length > 0) {
            console.log("else testquery pending");
            if (request.query?.type.includes("leave")) {
                console.log("if approval leave req");
                try {
                    let result = await approvalService.getApprovalsBySuperAdminLeaveQuery(
                        request.params.superadminId,
                        request.query
                    );
                    console.log(result,"result callSuperAdmin")
                    reply.send(result);
                } catch (error: any) {
                    reply.status(500).send(error.message);
                }
            } else if (request.query?.type.includes("attendance")) {
                console.log("else approval attendancereqularize req");
                try {
                    let result = await approvalService.getApprovalsBySuperAdminAttendanceQuery(
                        request.params.superadminId,
                        request.query
                    );
                    reply.send(result);
                } catch (error: any) {
                    reply.status(500).send(error.message);
                }
            }
        } else {
            try {
                let result = await approvalService.getApprovalbySuperAdmin(
                    request.params.superadminId
                );
                reply.send(result);
            } catch (error) {
                reply.status(500).send(error.message);
            }
        }
}