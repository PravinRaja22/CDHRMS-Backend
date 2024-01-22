import Person from "../database/models/Person.model";
import Account from "../database/models/Account.model";
export var UserController;
(function (UserController) {
    UserController.fetchUsers = async (req, res) => {
        let result = await Account.findAll({
            include: [
                { model: Person, required: false },
            ],
        });
        console.log(result);
        res.send(result);
    };
    UserController.createRecord = async (req, res) => {
        let account = new Account({ name: "Sample Company" });
        account.set({ name: "Sample Company2" });
        let result = await account.save();
        console.log(result);
        let person = new Person({
            account_id: 1,
            first_name: "Raghu",
            last_name: "M",
        });
        result = await person.save();
        console.log(result);
        res.send(result);
    };
})(UserController || (UserController = {}));
//# sourceMappingURL=User.controller.js.map