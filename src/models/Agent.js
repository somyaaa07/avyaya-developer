import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const Agent = sequelize.define('Agent', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:        { type: DataTypes.STRING(100), allowNull: false },
  email:       { type: DataTypes.STRING(100), allowNull: false, unique: true },
  phone:       { type: DataTypes.STRING(20) },
  photo:       { type: DataTypes.STRING(255) },
  description: { type: DataTypes.TEXT },
}, {
  tableName: 'agents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Agent;