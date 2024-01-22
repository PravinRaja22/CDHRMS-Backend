"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const MetricPreset_model_1 = require("./MetricPreset.model");
const Person_model_1 = require("./Person.model");
class MetricPresetEntry extends sequelize_1.Model {
}
exports.default = MetricPresetEntry;
MetricPresetEntry.init({
    metric_preset_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: MetricPreset_model_1.default,
            key: "id",
            deferrable: new sequelize_1.Deferrable.INITIALLY_IMMEDIATE(),
        },
        allowNull: false,
    },
    week: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    day: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    target_feed: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    target_weight: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    target_water: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Person_model_1.default,
            key: "id",
            deferrable: new sequelize_1.Deferrable.INITIALLY_IMMEDIATE(),
        },
        allowNull: true,
    },
    updated_by: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Person_model_1.default,
            key: "id",
            deferrable: new sequelize_1.Deferrable.INITIALLY_IMMEDIATE(),
        },
        allowNull: true,
    },
}, { sequelize: index_1.sequelize, underscored: true });
