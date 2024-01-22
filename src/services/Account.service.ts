import * as _ from "lodash"
import AccountModel from "../database/models/Account.model.js"


export module AccountService{
    export const createAccount = async (inObj)=>{
        let result = await AccountModel.create(inObj);
        console.log(result)
        return result;
    }
    export const searchAccounts = async (searchObj)=>{
        let result =  await AccountModel.findAll(searchObj);
        console.log(result);
        return result;
    }

    export const updateAccount = async (inObj:any)=>{
        let account:any=  await AccountModel.findByPk(inObj.id);
        _.merge(account,inObj)
        let result = await account.save()
        console.log(result);
        return result;
    }
}
    



