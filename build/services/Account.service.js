import * as _ from "lodash";
import AccountModel from "../database/models/Account.model";
export var AccountService;
(function (AccountService) {
    AccountService.createAccount = async (inObj) => {
        let result = await AccountModel.create(inObj);
        console.log(result);
        return result;
    };
    AccountService.searchAccounts = async (searchObj) => {
        let result = await AccountModel.findAll(searchObj);
        console.log(result);
        return result;
    };
    AccountService.updateAccount = async (inObj) => {
        let account = await AccountModel.findByPk(inObj.id);
        _.merge(account, inObj);
        let result = await account.save();
        console.log(result);
        return result;
    };
})(AccountService || (AccountService = {}));
//# sourceMappingURL=Account.service.js.map