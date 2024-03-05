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
    console.log(result.status ,'result in timesheet');

    if(result.status === 'failure'){
      console.log(result.status ,'inside failure');
      reply.status(404).send(result)

  }
  else{
      reply.send(result)
  }
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
export async function getTimeSheetbydateanduser(request: any, reply: any) {
  try {
    console.log('upsert Users are')
    const {userId,applidDate} = request.params
    let result = await timeSheetServices.getTimeSheetbydateanduser(userId,applidDate)
    reply.send(result)
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getTimeSheetForMonthandYear(requst:any , reply:any){
  try{
      const {userId,month,year} = requst.params
      console.log(requst.params)
      let Result = await timeSheetServices.getTimeSheetForMonthandYear(userId,month,year)
      reply.send(Result)
  }
  catch(error){
      reply.status(500).send(error.message)
  }
}
export async function excelGenearator(requst:any ,reply:any){
  try{
    
      let Result = await timeSheetServices.excelGenearator(requst ,reply)
      reply.send(Result)
  }
  catch(error){
      reply.status(500).send(error.message)
  }
}



