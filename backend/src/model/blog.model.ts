import mongoose, { Date, Document } from "mongoose";
import { IBlog } from "types/Imodels";


const blogSchema=new mongoose.Schema<IBlog>({
    title:{type:String,required:true},
    content:{type:String,required:true},
    imageUrl:{type:String,required:true},
    isPublished:{type:Boolean,required:true,default:false},
    userId:{type:mongoose.Schema.ObjectId,ref:"User",required:true},
    
},{timestamps:true})
const Blog= mongoose.model<IBlog>("Blog",blogSchema)
export default Blog