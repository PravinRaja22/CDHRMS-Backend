import { attendanceRegularizeService } from "../../services/Hrms/attendanceRegularize.service.js";
export async function getAllAttendanceRegularize(request, reply) {
    try {
        let result = await attendanceRegularizeService.getAllAttendanceRegularize();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getAttendanceRegularizebyId(request, reply) {
    try {
        let result = await attendanceRegularizeService.getAttendanceRegularizebyId(request.params.id);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function insertAttendanceRegularize(request, reply) {
    try {
        console.log(request.body, 'insert Regulariize Check');
        let result = await attendanceRegularizeService.insertAttendanceRegularize(request.body);
        reply.send("Data Inserted Successfully");
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getAttendanceRegularizebyUser(request, reply) {
    try {
        //
        let result = await attendanceRegularizeService.getAttendanceRegularizebyUser(request.params.userId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function updateAttendanceRegularize(request, reply) {
    try {
        let result = await attendanceRegularizeService.updateAttendanceRegularize(request.params.id, request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
// export async function getRegularizeByUsers(request: any, reply: any) {
//     try {
//         console.log(request.params, "regularized User Data is ")
//         console.log(request.query.status ,"query")
//         let result = await attendanceRegularizeService.getRegularizeByUsers(request.params.userId ,request.query )
//         reply.send(result)
//     } catch (error) {
//         reply.status(500).send(error.message)
//     }
// }
//# sourceMappingURL=attendanceRegularize.Controller.js.map