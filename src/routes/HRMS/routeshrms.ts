import { FastifyInstance } from 'fastify';
import { 
  deleteUser, 
  getSingleUser, 
  getUser, 
  upsertUser 
} from '../../controllers/HRMS/user.Controller.js';
import { 
  getLeaveData, 
  getLeavesByApprover, 
  getLeavesByUsers, 
  getSingleLeaves, 
  upsertLeaves 
} from '../../controllers/HRMS/leave.Controller.js';

const Routes = function (fastify: FastifyInstance, opts: any, done: () => void) {
  //User Object Routes
    fastify.get('/users', getUser);
    fastify.get('/users/:id', getSingleUser);
    fastify.post('/users',upsertUser)
    fastify.delete('/users/:id',deleteUser)

  //Leave Object Routes
    fastify.get('/leaves', getLeaveData);
    fastify.get('/leaves/:id', getSingleLeaves);
    fastify.post('/leaves',upsertLeaves)
    fastify.get('/leaves/user/:userId',getLeavesByUsers)
    fastify.get('/leaves/approver/:approverId',getLeavesByApprover)


    done();
  };
  
  export default Routes;