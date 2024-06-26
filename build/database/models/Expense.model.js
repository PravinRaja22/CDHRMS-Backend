import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";
import Batch from "./Batch.model";
import Person from "./Person.model";
export default class Expense extends Model {
}
Expense.init({
    entry_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Batch,
            key: "id",
            deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
        },
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
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
//# sourceMappingURL=Expense.model.js.map