import {Sequelize} from "sequelize";

console.log(process.env.DATABASE_CONNECTION_STRING)
export const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING as string,{dialect:"postgres"});


import OptionValue from "./models/OptionValue.model.js";
import Person from "./models/Person.model.js"
import Account from "./models/Account.model.js"
import MetricPreset from "./models/MetricPreset.model.js";
import MetricPresetEntry from "./models/MetricPresetEntry.model.js";
import Farm from "./models/Farm.model.js";

import Shed from "./models/Shed.model.js";
import Batch from "./models/Batch.model.js";
import BatchShed from "./models/BatchShed.model.js";
import Feed from "./models/Feed.model.js";
import Water from "./models/Water.model.js";
import BodyWeight from "./models/BodyWeight.model.js";
import Temperature from "./models/Temperature.model.js";
import Mortality from "./models/Mortality.model.js";
import Vaccine from "./models/Vaccine.model.js";

import Sales from "./models/Sales.model.js";
import Expense from "./models/Expense.model.js";



Account.hasMany(Person);
Person.belongsTo(Account);

Account.hasMany(Farm);
Farm.belongsTo(Account);

Farm.hasMany(Shed);
Shed.belongsTo(Farm);

Batch.belongsToMany(Shed, {through : BatchShed})
Shed.belongsToMany(Batch, {through : BatchShed})

Batch.hasMany(Feed);
Feed.belongsTo(Batch);

Batch.hasMany(Water);
Water.belongsTo(Batch);

Batch.hasMany(BodyWeight);
BodyWeight.belongsTo(Batch);

Batch.hasMany(Temperature);
Temperature.belongsTo(Batch);

Batch.hasMany(Mortality);
Mortality.belongsTo(Batch);

Batch.hasMany(Vaccine);
Vaccine.belongsTo(Batch);

Batch.hasMany(Sales);
Sales.belongsTo(Batch);

Batch.hasMany(Expense);
Expense.belongsTo(Batch);

Account.hasMany(MetricPreset);
MetricPreset.belongsTo(Account);

MetricPreset.hasMany(MetricPresetEntry);
MetricPresetEntry.belongsTo(MetricPreset);



export const init = async ()=>{ 
    console.log("Hello")
    // let result = await sequelize.sync({alter : true})
    return true;
} 



