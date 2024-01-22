import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";

import Person from "./Person.model";

export default class OptionValue extends Model {}

OptionValue.init(
  {
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
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
  }
);
