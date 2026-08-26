import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const PropertyImage = sequelize.define('PropertyImage', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  property_id: { type: DataTypes.INTEGER, allowNull: false },
  url:         { type: DataTypes.STRING(255), allowNull: false },
  order:       { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'property_images',
  timestamps: false,
});

export default PropertyImage;