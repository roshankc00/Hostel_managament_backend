import mongoose from "mongoose";
const validateMongodbId=(id)=>{
    const isvalid=mongoose.Types.ObjectId.isValid(id);
    console.log(isvalid,"yeta")
    return isvalid
 
}

export default validateMongodbId 