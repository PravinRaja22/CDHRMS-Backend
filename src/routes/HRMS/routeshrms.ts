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
import { getLeaveBalanceByUsers, upsertLeaveBalanceByUsers } from '../../controllers/HRMS/leaveBalance.Controller.js';
import { getAttendanceDate, updateAttendance, upsertAttendance,getAttendanceByUserIdDate,updateAttendanceStatus, getsingleAttendance } from '../../controllers/HRMS/attendance.Controller.js';

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

    //Leave-Balance Object Routes
    fastify.get('/leave-balance/:userId',getLeaveBalanceByUsers)
    fastify.post('/leave-balance/:userId',upsertLeaveBalanceByUsers)
    
    //attendance
    
    fastify.get('/attendance',getAttendanceDate)
    fastify.post('/attendance',upsertAttendance)
    fastify.get('/attendance/:userId/:attendanceDate',getAttendanceByUserIdDate)
    fastify.put('/attendance/:userId/:attendanceDate',updateAttendance)
    fastify.put('/attendance/:attendanceDate',updateAttendanceStatus)
    fastify.get('/attendance/:id',getsingleAttendance)
    done();
  };
  
  export default Routes;