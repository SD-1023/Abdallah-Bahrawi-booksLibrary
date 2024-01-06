import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('Books', 'root', 'root', {
  host: 'localhost',
  // the code is intended to work with a MySQL database
  dialect: 'mysql'
})

export {sequelize};
