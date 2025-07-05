const mongoose = require('mongoose')

const PixelSchema = new mongoose.Schema({
    direction:{type:String},
    pixels:{type:Number}
},{timestamps:true})

module.exports = mongoose.model('Pixel', PixelSchema)
