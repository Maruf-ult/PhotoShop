import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
     userId: {
          type:mongoose.Schema.Types.ObjectId,
          reg:'Users',
          required:true
     },
     fileName:{
         type:String,
         required:true
     },
     filePath:{
          type:String,
     },
     downloadedAt:{
          type:Date,
          default:Date.now()
     }
})

const downloadModel = mongoose.model("downloads",downloadSchema);
export default downloadModel;