import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

let mongoServer;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Use persistent MongoDB for development if no URI provided
    if (!mongoUri || mongoUri === "mongodb://localhost:27017/cozy-corner") {
      if (process.env.NODE_ENV === "development") {
        try {
          const { MongoMemoryServer } = await import("mongodb-memory-server");
          
          // Start persistent MongoDB if not already running
          if (!mongoServer) {
            const dataDir = path.resolve(__dirname, '../../data');
            mongoServer = await MongoMemoryServer.create({
              instance: {
                dbPath: dataDir,
                storageEngine: 'wiredTiger'
              }
            });
            mongoUri = mongoServer.getUri();
            console.log(`✅ Using PERSISTENT MongoDB at: ${dataDir}`);
          }
        } catch (err) {
          console.warn("MongoDB Memory Server not available, using local connection");
          mongoUri = "mongodb://localhost:27017/cozy-corner";
        }
      }
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

