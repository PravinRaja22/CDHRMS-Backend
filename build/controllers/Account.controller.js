import * as _ from "lodash";
import { AccountService } from "../services/Account.service.js";
import { Sequelize, Op } from "sequelize";
export var AccountController;
(function (AccountController) {
    AccountController.getAccount = async (req, res) => {
        let result = await AccountService.searchAccounts({ id: req.params.id });
        res.send(result);
    };
    AccountController.createAccount = async (req, res) => {
        let result = await AccountService.createAccount(req.body);
        res.send(result);
    };
    AccountController.updateAccount = async (req, res) => {
        let result = await AccountService.updateAccount(req.body);
        res.send(result);
    };
    AccountController.getAccounts = async (req, res) => {
        let search_columns = ['name'];
        let filterObj = req.body;
        if (filterObj.search_key) {
            filterObj = _.omit(filterObj, ['search_key']);
            filterObj = { where: { ...filterObj, ...{ [Op.or]: search_columns.map(c => (Sequelize.where(Sequelize.fn('lower', Sequelize.col(c)), {
                            [Op.like]: `%${_.toLower(req.body.search_key)}%`
                        }))) } } };
            console.log(filterObj);
        }
        let result = await AccountService.searchAccounts(filterObj);
        res.send(result);
    };
})(AccountController || (AccountController = {}));
// schema
//# sourceMappingURL=Account.controller.js.map