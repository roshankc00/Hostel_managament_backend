import mongoose from "mongoose";
import 'dotenv/config'


export const connnectDatabase=()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log(`connnected to the database`)
    }).catch(()=>console.log("unable to connect to the database"))
}