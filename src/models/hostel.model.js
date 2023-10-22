import mongoose from "mongoose";


const hostelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        city:{
            type:String
        },
        localLocation:{
            type:String
        }
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending',"verified"],
        default:'pending'
    },
    images:[{
        url:{
            type:String
        },
        publicId:{
            type:String
        }
    }
    ]
},{timestamps:true})



const HostelModel=mongoose.model('Hostel',hostelSchema)

export default HostelModel