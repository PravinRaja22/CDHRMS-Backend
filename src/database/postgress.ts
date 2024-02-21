// import { Sequelize } from 'sequelize';
// export const sequelize = new Sequelize('HRMS', 'postgres', 'admin', {
//   host: 'localhost',
//   dialect: 'postgres',
// });
// try {
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');

// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

import pkg from "pg";

const pool = new pkg.Pool({
  user: "postgres",
  password: "Maples71",
  host: "5.189.159.233",
  port: 65432,
  database: "hrms"
  // user: "postgres",
  // password: "admin",
  // host: "192.168.0.127",
  // port: 5432,
  // database: "HRMS",
});
pool.on("connect", () => {
  console.log("Database connected");
});
pool.on("error", (err) => {
  console.log("error is ");
  console.error("Error connecting to the database:", err.message);
});
export const query = async (stmt, options) => {
  console.log("querying");
  console.log(options);
  if (Object.keys(options).length > 0 || options.length > 0) {
    console.log("if");
    return await pool.query(stmt, options);
  } else {
    console.log("else");
    return await pool.query(stmt);
  }
};

export default pool;
