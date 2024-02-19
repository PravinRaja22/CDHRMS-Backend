import { leaveService } from "../../services/Hrms/leave.service.js"
export async function getLeaveData(request: any, reply: any) {
  try {
    let result = await leaveService.getLeaves()
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
export async function getSingleLeaves(request: any, reply: any) {
  try {
    let result = await leaveService.getSingleLeaves(request.params.id)
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
export async function upsertLeaves(request: any, reply: any) {
  try {
    let result = await leaveService.upsertLeaves(request)
    console.log(result,"upsertLeaves control");
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
export async function getLeavesByUsers(request: any, reply: any) {

  console.log(request.query, "getUser testquery");
  
  if (Object.keys(request.query).length > 0) {
    
    if(request.query.excludePending){
      console.log("testquery if ! pending");
      try {
        let result = await leaveService.getLeavesByUsersExcludePending(request.params.userId, request.query)
        reply.send(result)
      } catch (error: any) {
        reply.status(500).send(error.message);
      }
    }else{
      console.log("else testquery pending");
      try {
        let result = await leaveService.getLeavesByUsersQuery(request.params.userId, request.query)
        reply.send(result)
      } catch (error: any) {
        reply.status(500).send(error.message);
      }
    }
 
  }
  else {
    try {
      let result = await leaveService.getLeavesByUsers(request.params.userId)
      reply.send(result)
    } catch (error: any) {
      reply.status(500).send(error.message);
    }
  }

}
export async function getLeavesByApprover(request: any, reply: any) {
  try {
    let result = await leaveService.getLeavesByApprover(request.params.approverId)
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}