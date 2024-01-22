import {v4 as id4,  v5 as id5 } from 'uuid';
import Person from "../database/models/Person.model";
import { UserService } from "../services/User.service";
import { CacheStore } from "../helpers/CacheStore";

export module SessionController {
  export const startSession = async (req, reply)=>{

    
    const generateNewSession = async ()=>{
      const newSessionId = id5(id4(),UUID_NAME_SPACE);
      try{
        let cacheStoreResult = await CacheStore.get(newSessionId);
        if(cacheStoreResult===0){
          await CacheStore.set(newSessionId,{isNew:true});
          return newSessionId;
        }
        else{
          return await generateNewSession();
        }
      }
      catch(error){
        console.log(error);
        return 'ERROR'
      }
    }
    
    let result = await generateNewSession();
    if(result === 'ERROR'){
      reply.code(422)
      return {ERROR_CODE : 1};
    } 
    reply.code(200);
    return({sid : result});
  }

  export const identify = async (req, res) => {
    try {
      let user = await UserService.findUserByKey("username", req.body.username.toString());
      if (!user) {
        res.code(422).send({ APP_ERROR_CODE: 3 });
      } else {
        let OTP = 123456; //Math.floor(Math.random() * 999999) + 1
        let TTL = 1 * 24 * 60 * 60; //1 day
        CacheStore.set(req.sessionId, { OTP, user :{id: user.id} }, TTL);
        res.send({ msg: "success" });
      }
    } catch (error) {
      res.code(500).send({ msg: error });
    }
  };

  export const validate = async (req, res) => {
    try {

      if (!req.session.OTP) {
        CacheStore.remove(req.sessionId);
        res.status(422).send({ ERROR_CODE: "OTP_NOT_GENERATED" });
        return;
      }

      if (req.session.OTP && req.session.OTP != req.body.otp) {
        CacheStore.set(req.sessionId, {
          user: {id : req.session.user.id},
          OTP: req.session.OTP,
        });
        res.status(422).send({ ERROR_CODE: "OTP_MISMATCH" });
        return;
      }
      let user = await UserService.findUserByKey("id", req.session.user.id);
      if (!user) {
        res.status(422).send({ ERROR_CODE: "UNKOWN_USER" });
      } else {
        CacheStore.set(req.sessionId, { isValidated: true, user: user });
        res.send({ msg: "success" });
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({ msg: error });
    }
  };
  export const getSession = async (req, res) => {};

  export const updateSession = async (req, res) => {};

  export const logout = async (req, res) => {};
}

const UUID_NAME_SPACE = 'ce3cca90-d46e-59d2-b1e6-8cf6e9aa8b5a';