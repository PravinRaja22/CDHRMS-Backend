import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index.js";

export default class Account extends Model {}
Account.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
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
