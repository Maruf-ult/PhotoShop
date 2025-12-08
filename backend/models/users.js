import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
     name:{
          type:String,
          required:true,
          min:[5,"Name must have min 5 characters"]
     },
     email:{
          type:String,
          required:true,
          unique:true,
     },
     password:{
          type:String,
          required:true,
          min:[6,"must have at least 6 charcters"]
     },
     isAdmin:{
         type:Boolean,
         default:false,
     },
     image:{
          type:String,
          required:true,
     }
},{timestamps:true})


const UserModel = mongoose.model("Users",UserSchema);
export default UserModel;