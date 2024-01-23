import { userService } from '../../services/Hrms/user.service.js';
export async function getUser(request, reply) {
    try {
        let result = await userService.getAllUsers();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getSingleUser(request, reply) {
    console.log(request.params.id, "getSingleUser callback request");
    try {
        const recId = request.params.id;
        let result = await userService.getSingleUser(recId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertUser(request, reply) {
    try {
        console.log('upsert Users are');
        let result = await userService.upsertUser(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deleteUser(request, reply) {
    try {
        let result = await userService.deleteUser(request.params.id);
        return result;
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=user.Controller.js.map