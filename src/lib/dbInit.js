import sequelize from "@/lib/db";

// ── Import ALL models (order matters for associations) ─────
import User from "@/models/User";
import Agent from "@/models/Agent";
import Property from "@/models/Property";
import PropertyImage from "@/models/property_images";
import Inquiry from "@/models/Inquiry";
import SavedProperty from "@/models/SavedProperty";

// ── Associations ───────────────────────────────────────────
Agent.hasMany(Property, { foreignKey: "agent_id", as: "properties" });
Property.belongsTo(Agent, { foreignKey: "agent_id", as: "agent" });

Property.hasMany(PropertyImage, { foreignKey: "property_id", as: "images" });
PropertyImage.belongsTo(Property, { foreignKey: "property_id" });

Property.hasMany(Inquiry, { foreignKey: "property_id", as: "inquiries" });
Inquiry.belongsTo(Property, { foreignKey: "property_id", as: "property" });

Property.hasMany(SavedProperty, { foreignKey: "property_id" });
SavedProperty.belongsTo(Property, { foreignKey: "property_id" });

User.hasMany(SavedProperty, { foreignKey: "user_id" });
SavedProperty.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Property, { foreignKey: "user_id", as: "listings" });
Property.belongsTo(User, { foreignKey: "user_id", as: "owner" });

// Yeh line add karo existing associations ke saath

// ── Export models (import from here in all routes) ─────────
export { User, Agent, Property, PropertyImage, Inquiry, SavedProperty };

// ── Sync ───────────────────────────────────────────────────
// IMPORTANT: alter:true use NAHI karte
// users table pe ER_TOO_MANY_KEYS crash karta tha
// Sirf naye tables individually sync karo
let initialized = false;
let initPromise = null;

const NEW_MODELS = [
  User,
  Agent,
  Property,
  PropertyImage,
  Inquiry,
  SavedProperty,
];
// const NEW_MODELS = [PropertyImage, Inquiry, SavedProperty];

// async function dbInit() {
//   if (initialized) return;
//   try {
//     await sequelize.authenticate();
//     console.log('✅ MySQL connected!');

//     for (const model of NEW_MODELS) {
//       await model.sync({ force: false }); // CREATE TABLE IF NOT EXISTS
//       console.log('✅ Table ready: ' + model.getTableName());
//     }

//     initialized = true;
//     console.log('✅ DB init complete!');
//   } catch (error) {
//     console.error('❌ DB Error:', error);
//     throw error;
//   }
// }

// export default dbInit;

async function dbInit() {
  // Already initialized
  if (initialized) {
    return;
  }

  // If initialization is already running,
  // wait for the same initialization
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await sequelize.authenticate();

      console.log("✅ MySQL connected!");

      for (const model of NEW_MODELS) {
        await model.sync({ force: false });

        console.log("✅ Table ready: " + model.getTableName());
      }

      initialized = true;

      console.log("✅ DB init complete!");
    } catch (error) {
      console.error("❌ DB Error:", error);
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export default dbInit;
