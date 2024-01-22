import * as _ from "lodash"
import FarmModel from "../database/models/Farm.model"


export module FarmService{
    export const createFarm = async (inObj)=>{
        let result = await FarmModel.create(inObj);
        console.log(result)
        return result;
    }
    export const searchFarms = async (searchObj)=>{
        let result =  await FarmModel.findAll(searchObj);
        console.log(result);
        return result;
    }

    export const updateFarm = async (inObj:any)=>{
        let farm:any=  await FarmModel.findByPk(inObj.id);
        _.merge(farm,inObj)
        let result = await farm.save()
        console.log(result);
        return result;
    }
}
    



