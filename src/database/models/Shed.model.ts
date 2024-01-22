import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";

import Farm from "./Farm.model";
import Person from "./Person.model";

export default class Shed extends Model {}

Shed.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    farm_id: {
      type: DataTypes.INTEGER,
      allowNull : false,
      references: {
        model: Farm,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
