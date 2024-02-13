import { userService } from '../../services/Hrms/user.service.js';
import { v4 as uuidv4 } from 'uuid';
export async function getUser(request: any, reply: any) {
  
 console.log(request.query,"getUser query");
 if(Object.keys(request.query).length>0){
  try {
    let result = await userService.getUsersByQueries(request.query)
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
 }else{
  try {
    let result = await userService.getAllUsers()
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
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
    // reply.send(result)
    console.log(result.status)
    if (result.status === 'sucess') {
      const sessionId = uuidv4();
      console.log(sessionId, ' Session ID ID ')
      // request.session.set('sessionId', sessionId);
      console.log(`Session ID ${sessionId} set successfully!`)
      console.log(sessionId)
      reply.send({sessionId,userData:result.result})
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



export const getUsersBankdetails =async(request:any,reply:any)=>{
  try{
    console.log(request.params,"request");
    let result = await userService.getUsersBankdetails(request.params.id)
    return result
  }catch(error){
    reply.status(500).send(error.message)
  }
}

export const getUsersPFdetails =async(request:any,reply:any)=>{
  try{
    console.log(request.params,"request");
    let result = await userService.getUsersPFdetails(request.params.id)
    return result
  }catch(error){
    reply.status(500).send(error.message)
  }
}

export const getUsersMedicalInsurence =async(request:any,reply:any)=>{
  try{
    console.log(request.params,"request");
    let result = await userService.getUsersMedicalInsurence(request.params.id)
    return result
  }catch(error){
    reply.status(500).send(error.message)
  }
}