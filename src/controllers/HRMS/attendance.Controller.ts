import { attendanceService } from "../../services/Hrms/attendance.service.js";

export async function getAttendanceDate(request:any,reply:any){
    try{
        let result = await attendanceService.getAttendanceData()
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message);
    }
}

export async function upsertAttendance(request:any,reply:any){
    try{
        let result = await attendanceService.upsertAttendance(request.body)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}

export async function getAttendanceByUserIdDate(request:any,reply:any){
    try{
        let result = await attendanceService.getAttendanceByUserIdDate(request.params)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }

}

export async function updateAttendance(request:any,reply:any){
    try{
        let result = await attendanceService.updateAttendance(request.params,request.body)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}

export async function updateAttendanceStatus(request:any,reply:any){
    try{
        let result = await attendanceService.updateAttendanceStatus(request.params)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}