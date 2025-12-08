import mongoose from "mongoose";


const dbConnection = async ()=>{
     try {
          const MONGO_URI = `${process.env.DB_URL}`
          await mongoose.connect(MONGO_URI);
          console.log(`database connected successfully`);
     } catch (error) {
          console.log(`Error connection database: ${error}`);
          process.exit(1);
     }
}

export default dbConnection;