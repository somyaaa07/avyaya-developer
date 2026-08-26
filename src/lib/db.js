import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'estate',
  process.env.MYSQL_USER     || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host:    process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;