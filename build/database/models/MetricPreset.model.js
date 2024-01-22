import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";
import Account from "./Account.model";
import Person from "./Person.model";
export default class MetricPreset extends Model {
}
MetricPreset.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
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
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
//# sourceMappingURL=MetricPreset.model.js.map