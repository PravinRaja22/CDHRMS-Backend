import Person from "../database/models/Person.model";
import OptionValue from "../database/models/OptionValue.model";
export var UserService;
(function (UserService) {
    UserService.findUserByKey = async (key, value) => {
        let result = await Person.findAll({ include: [{ model: OptionValue, as: "user_role" }], where: {
                [key]: value
            } });
        if (result.length > 0)
            return result[0];
        return null;
    };
})(UserService || (UserService = {}));
//# sourceMappingURL=User.service.js.map