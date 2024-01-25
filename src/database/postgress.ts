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


import pkg from 'pg';

const pool = new pkg.Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

pool.on('connect', () => {
  console.log('Database connected');
});

pool.on('error', (err) => {
  console.log('error is ')
  console.error('Error connecting to the database:', err.message);
});

export default pool;

