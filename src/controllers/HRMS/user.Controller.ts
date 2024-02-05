import { userService } from '../../services/Hrms/user.service.js';
import { v4 as uuidv4 } from 'uuid';
export async function getUser(request: any, reply: any) {
  try {
    let result = await userService.getAllUsers()
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getAuthorizeduser(request, reply) {
  try {
    console.log('get Authorized User')
    // console.log(request)
    console.log(request.userData.result.account.username)
    // let result = await userService.getAllUsers();
    let result = await userService.getAuthorizedUserdata(request.userData.result.account.username)
    console.log(result ,' data set data st')
    reply.send(result)
    console.log(result.status)
    if (result.status === 'sucess') {
      const sessionId = uuidv4();
      console.log(sessionId, ' Session ID ID ')
      // request.session.set('sessionId', sessionId);
      console.log(`Session ID ${sessionId} set successfully!`)
      reply.send(sessionId)
    }
    else {
      reply.send('session Id Not Created Please Try again')
    }

  } catch (error) {
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
    let result = await userService.deleteUser(request.params.id)
    return result
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}



