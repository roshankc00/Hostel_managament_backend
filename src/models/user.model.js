import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String
    },
    phone:{
        type:String,
        unique:true
    },
    role:{
        type:String,
        enum:['user','admin',"owner"],
        default:"user"
    }

},{timestamps:true})



UserSchema.pre('save',async function(){
    if (this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
    }
})
UserSchema.methods.matchPassword = async function (password) {
    const isPasswordCorrect = await bcrypt.compare(password, this.password);
    return isPasswordCorrect;
  };


 const UserModel=mongoose.model('User',UserSchema)
  export default UserModel