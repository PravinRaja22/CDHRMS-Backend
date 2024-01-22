"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const Account_model_1 = require("./Account.model");
class FeedConsumptionPreset extends sequelize_1.Model {
}
exports.default = FeedConsumptionPreset;
FeedConsumptionPreset.init({
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Account_model_1.default,
            key: "id",
            deferrable: new sequelize_1.Deferrable.INITIALLY_IMMEDIATE(),
        },
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, { sequelize: index_1.sequelize, underscored: true });
