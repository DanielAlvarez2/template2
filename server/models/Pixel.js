import mongoose from 'mongoose'
const PixelSchema = new mongoose.Schema({
    direction:{type:String},
    pixels:{type:Number}
},{timestamps:true})
export default mongoose.model('Pixel', PixelSchema)
