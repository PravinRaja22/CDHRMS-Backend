import { userService } from '../../services/Hrms/user.service.js';
export async function getUser(request: any, reply: any) {
  try {
    let result = await userService.getAllUsers()
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}



export async function getSingleUser(request: any, reply: any) {
  console.log(request.params.id, "getSingleUser callback request");
  try {

    const recId = request.params.id;
    let result = await userService.getSingleUser(recId)
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}


export async function upsertUser(request: any, reply: any) {
  try {
console.log('upsert Users are')
    let result = await userService.upsertUser(request.body)
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}



export async function deleteUser(request: any, reply: any) {
  try {
    let result =await userService.deleteUser(request.params.id)
    return result
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}



