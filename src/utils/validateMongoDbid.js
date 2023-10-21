import mongoose from "mongoose";
const validateMongodbId=(id)=>{
    const isvalid=mongoose.Types.ObjectId.isValid(id);

    return isvalid
 
}

export default validateMongodbId 