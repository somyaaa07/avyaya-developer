import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const Inquiry = sequelize.define('Inquiry', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  property_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id:     { type: DataTypes.INTEGER, allowNull: true },  // null = guest
  name:        { type: DataTypes.STRING(100), allowNull: false },
  email:       { type: DataTypes.STRING(100), allowNull: false },
  phone:       { type: DataTypes.STRING(20) },
  message:     { type: DataTypes.TEXT, allowNull: false },
  status:      { type: DataTypes.ENUM('new', 'read', 'replied'), defaultValue: 'new' },
}, {
  tableName: 'inquiries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Inquiry;