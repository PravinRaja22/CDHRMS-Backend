import { attendanceRegularizeService } from "../../services/Hrms/attendanceRegularize.service.js";

export async function getAllAttendanceRegularize(request:any,reply:any){
    try{
        let result = await attendanceRegularizeService.getAllAttendanceRegularize()
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message);
    }
}

export async function getAttendanceRegularizebyId(request:any,reply:any){
    try{
        let result = await attendanceRegularizeService.getAttendanceRegularizebyId(request.params.id)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message);
    }
}

export async function insertAttendanceRegularize(request:any,reply:any) {
    try{
        console.log(request.body ,'insert Regulariize Check')
        let result = await attendanceRegularizeService.insertAttendanceRegularize(request.body)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}

export async function getAttendanceRegularizebyUser(request:any,reply:any){
    try{
        //
        let result = await attendanceRegularizeService.getAttendanceRegularizebyUser(request.params.userId)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}

export async function updateAttendanceRegularize(request:any,reply:any){
    try{
        let result = await attendanceRegularizeService.updateAttendanceRegularize(request.params.id,request.body)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}
export async function getRegularizeByUsers(request:any,reply:any){
    try{
        console.log(request.params)
        // let result = await attendanceRegularizeService.updateAttendanceRegularize(request.params.id,request.body)
        reply.send("result")
    }catch(error){
        reply.status(500).send(error.message)
    }
}