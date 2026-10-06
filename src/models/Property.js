import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const listField = (name) => ({
  type: DataTypes.TEXT,
  allowNull: true,
  get() {
    const raw = this.getDataValue(name);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },
  set(value) {
    if (value == null || value === '') {
      this.setDataValue(name, null);
    } else if (Array.isArray(value)) {
      this.setDataValue(name, JSON.stringify(value));
    } else {
      this.setDataValue(
        name,
        JSON.stringify(
          String(value).split(',').map((s) => s.trim()).filter(Boolean)
        )
      );
    }
  },
});



const Property = sequelize.define('Property', {
  id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title:         { type: DataTypes.STRING(200), allowNull: false },
  description:   { type: DataTypes.TEXT },
  price:         { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  type:          { type: DataTypes.ENUM('buy', 'sell', 'rent'), allowNull: false },
  property_type: { type: DataTypes.ENUM('apartment', 'house', 'villa', 'plot', 'commercial','residential'), allowNull: false },
  location:      { type: DataTypes.STRING(200), allowNull: false },
  city:          { type: DataTypes.STRING(100), allowNull: false },
  area:          { type: DataTypes.DECIMAL(10, 2) },
  bedrooms:      { type: DataTypes.INTEGER },
  bathrooms:     { type: DataTypes.INTEGER },
  agent_id:      { type: DataTypes.INTEGER },
  user_id:       { type: DataTypes.INTEGER },        // ← nayi field
  contact_email: { type: DataTypes.STRING(100) },
  
   // ── Naye specifications ──
  nearby_landmarks:    listField('nearby_landmarks'),
  amenities:           listField('amenities'),
  property_highlights: listField('property_highlights'),
  age_of_property:     { type: DataTypes.STRING(30) },
  furnishing:          { type: DataTypes.STRING(30) },
  transaction_type:    { type: DataTypes.STRING(30) },
  balcony:             { type: DataTypes.INTEGER },
  total_floors:        { type: DataTypes.INTEGER },
  parking:             { type: DataTypes.STRING(30) },
  facing:              { type: DataTypes.STRING(30) },
  construction_type:   { type: DataTypes.STRING(40) },
  
  // ← nayi field
  status:        { type: DataTypes.ENUM('active', 'sold', 'rented'), defaultValue: 'active' },
}, {
  tableName:  'properties',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
});

export default Property;