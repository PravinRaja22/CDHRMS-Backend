"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const Person_model_1 = require("./Person.model");
class LoV extends sequelize_1.Model {
}
exports.default = LoV;
LoV.init({
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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
}, {
    sequelize: index_1.sequelize,
    underscored: true,
    scopes: {
        breed_types: {
            where: {
                type: "breed_type",
                active: true,
            },
        },
        user_roles: {
            where: {
                type: "user_role",
                active: true,
            },
        },
    },
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
