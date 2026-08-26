import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const Property = sequelize.define('Property', {
  id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title:         { type: DataTypes.STRING(200), allowNull: false },
  description:   { type: DataTypes.TEXT },
  price:         { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  type:          { type: DataTypes.ENUM('buy', 'sell', 'rent'), allowNull: false },
  property_type: { type: DataTypes.ENUM('apartment', 'house', 'villa', 'plot', 'commercial'), allowNull: false },
  location:      { type: DataTypes.STRING(200), allowNull: false },
  city:          { type: DataTypes.STRING(100), allowNull: false },
  area:          { type: DataTypes.DECIMAL(10, 2) },
  bedrooms:      { type: DataTypes.INTEGER },
  bathrooms:     { type: DataTypes.INTEGER },
  agent_id:      { type: DataTypes.INTEGER },
  user_id:       { type: DataTypes.INTEGER },        // ← nayi field
  contact_email: { type: DataTypes.STRING(100) },    // ← nayi field
  status:        { type: DataTypes.ENUM('active', 'sold', 'rented'), defaultValue: 'active' },
}, {
  tableName:  'properties',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
});

export default Property;