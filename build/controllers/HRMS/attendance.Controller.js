import { attendanceService } from "../../services/Hrms/attendance.service.js";
export async function getAttendanceDate(request, reply) {
    try {
        let result = await attendanceService.getAttendanceData();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertAttendance(request, reply) {
    try {
        let result = await attendanceService.upsertAttendance(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getAttendanceByUserIdDate(request, reply) {
    try {
        let result = await attendanceService.getAttendanceByUserIdDate(request);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function updateAttendance(request, reply) {
    try {
        let result = await attendanceService.updateAttendance(request.params, request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function updateAttendanceStatus(request, reply) {
    try {
        let result = await attendanceService.updateAttendanceStatus(request.params);
        console.log(result, 'Final Result data is ');
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getsingleAttendance(request, reply) {
    try {
        let result = await attendanceService.getsingleAttendance(request.params.id);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertBulkAttendance(request, reply) {
    try {
        let result = await attendanceService.upsertBulkAttendance(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getAttendanceByUserIdMonth(request, reply) {
    try {
        let result = await attendanceService.getAttendanceByUserIdMonth(request.params);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getAttendaceForMonthandYear(requst, reply) {
    try {
        const { userId, month, year } = requst.params;
        console.log(requst.params);
        let Result = await attendanceService.getAttendaceForMonthandYear(userId, month, year);
        reply.send(Result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertAttendancetime(requst, reply) {
    try {
        console.log(requst.body);
        console.log(requst.params);
        const { userId } = requst.params;
        let Result = await attendanceService.upsertAttendanceTime(requst.body, userId);
        reply.send(Result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=attendance.Controller.js.map