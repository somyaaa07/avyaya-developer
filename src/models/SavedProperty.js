import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const SavedProperty = sequelize.define('SavedProperty', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:     { type: DataTypes.INTEGER, allowNull: false },
  property_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'saved_properties',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { unique: true, fields: ['user_id', 'property_id'] },
  ],
});

export default SavedProperty;