import mongoose from 'mongoose'
const DinnerSchema = new mongoose.Schema({
    section:{type:String},
    name:{type:String},
    allergies:{type:String},
    preDescription:{type:String},
    description:{type:String},
    price:{type:String},
    sequence:{type:Number}
},{timestamps:true})
export default mongoose.model('Dinner', DinnerSchema)