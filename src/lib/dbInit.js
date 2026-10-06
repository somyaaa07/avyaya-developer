// src/lib/dbInit.js

import sequelize from "@/lib/db";

import User from "@/models/User";
import Agent from "@/models/Agent";
import Property from "@/models/Property";
import PropertyImage from "@/models/property_images";
import Inquiry from "@/models/Inquiry";
import SavedProperty from "@/models/SavedProperty";

// Associations
Agent.hasMany(Property, {
  foreignKey: "agent_id",
  as: "properties",
});

Property.belongsTo(Agent, {
  foreignKey: "agent_id",
  as: "agent",
});

Property.hasMany(PropertyImage, {
  foreignKey: "property_id",
  as: "images",
});

PropertyImage.belongsTo(Property, {
  foreignKey: "property_id",
});

Property.hasMany(Inquiry, {
  foreignKey: "property_id",
  as: "inquiries",
});

Inquiry.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});

Property.hasMany(SavedProperty, {
  foreignKey: "property_id",
});

SavedProperty.belongsTo(Property, {
  foreignKey: "property_id",
});

User.hasMany(SavedProperty, {
  foreignKey: "user_id",
});

SavedProperty.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Property, {
  foreignKey: "user_id",
  as: "listings",
});

Property.belongsTo(User, {
  foreignKey: "user_id",
  as: "owner",
});

export {
  User,
  Agent,
  Property,
  PropertyImage,
  Inquiry,
  SavedProperty,
};

let initialized = false;
let initPromise = null;

const MODELS = [
  User,
  Agent,
  Property,
  PropertyImage,
  Inquiry,
  SavedProperty,
];

export async function dbInit() {
  if (initialized) return;

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await sequelize.authenticate();

      console.log("✅ MySQL connected!");

      for (const model of MODELS) {
        await model.sync({
          force: false,
        });

        console.log(`✅ Table ready: ${model.getTableName()}`);
      }

      initialized = true;

      console.log("✅ Database initialization complete!");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export default dbInit;