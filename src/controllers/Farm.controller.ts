import * as Joi from "joi";
import * as _ from "lodash";
import {FarmService} from "../services/Farm.service"

import {Sequelize, Op} from "sequelize";

export module FarmController{
    export const getFarm = async (req,res)=>{
        let result = await FarmService.searchFarms({id : req.params.id});
        res.send(result);
    }

    export const createFarm = async (req, res)=>{
        if(_.get(req,"session.user.role") !== 'admin'){
            req.body.account_id = req.sessions.user.account_id;
            let result = await FarmService.createFarm(req.body);
            res.send(result);
        }
        else{
            let result = await FarmService.createFarm(req.body);
            res.send(result);
        }
        
    }
    export const updateFarm = async (req,res)=>{
        if(_.get(req,"session.user.role") !== 'admin'){
            
        }
        else{
            let result = await FarmService.updateFarm(req.body);
            res.send(result);
        }

        
    }

    export const searchFarms = async (req,res)=>{
        let search_columns = ['name'];
        let filterObj = req.body;
        if(filterObj.search_key){
            filterObj = _.omit(filterObj,['search_key']);
            filterObj = {where : {...filterObj, ...{[Op.or] : search_columns.map(c=>(Sequelize.where(Sequelize.fn('lower', Sequelize.col(c)), {
                [Op.like]: `%${_.toLower(req.body.search_key)}%`
            })))}}};
            console.log(filterObj);
        }
        
        let result = await FarmService.searchFarms(filterObj);
        res.send(result);
    }

}
