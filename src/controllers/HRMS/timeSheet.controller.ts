import { timeSheetServices } from '../../services/Hrms/timeSheet.service.js';
import { userService } from '../../services/Hrms/user.service.js';
import { v4 as uuidv4 } from 'uuid';
export async function getTimeSheet(request: any, reply: any) {
  
  try {

    let result = await timeSheetServices.gettimeSheetServices(request.params)
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }

 
}



export async function upsertTimeSheet(request: any, reply: any) {
  try {
    console.log('upsert Users are')
    let result = await timeSheetServices.upserttimeSheetServices(request.body)
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