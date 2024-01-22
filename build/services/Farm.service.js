import * as _ from "lodash";
import FarmModel from "../database/models/Farm.model";
export var FarmService;
(function (FarmService) {
    FarmService.createFarm = async (inObj) => {
        let result = await FarmModel.create(inObj);
        console.log(result);
        return result;
    };
    FarmService.searchFarms = async (searchObj) => {
        let result = await FarmModel.findAll(searchObj);
        console.log(result);
        return result;
    };
    FarmService.updateFarm = async (inObj) => {
        let farm = await FarmModel.findByPk(inObj.id);
        _.merge(farm, inObj);
        let result = await farm.save();
        console.log(result);
        return result;
    };
})(FarmService || (FarmService = {}));
//# sourceMappingURL=Farm.service.js.map