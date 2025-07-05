import express from 'express'
import mongoose from 'mongoose'
import Dinner from './models/Dinner.js'
import Pixel from './models/Pixel.js'
const app = express()
const PORT = process.env.PORT || 9991
app.listen(PORT, ()=> console.log(`Server Running on Port: ${PORT}`))
app.use(express.static('../dist'))
app.use(express.json());

// MUST HAVE A SEMICOLON ON THE LINE BEFORE AN IIFE
(async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database Connected')
    }catch(err){
        console.log(err)
    }
})()
app.post('/api/dinner', async(req,res)=>{
    try{
        const maxSequence = await Dinner.findOne({section:req.body.section}).sort({sequence:-1})
        await Dinner.create({
            section:req.body.section,
            name:req.body.name,
            allergies:req.body.allergies,
            preDescription:req.body.preDescription,
            description:req.body.description,
            price:req.body.price,
            sequence: maxSequence ? maxSequence.sequence + 1 : 1 
        })
        console.log(`Added to Database: ${req.body.name}`)
        res.json(`Added to Database: ${req.body.name}`)
    }catch(err){
        console.log(err)
    }
})
app.delete('/api/dinner/:id',async(req,res)=>{
    try{
        const target = await Dinner.findById(req.params.id)
        const section = await Dinner.find({section:target.section})
        section.forEach(async(item)=> {
            item.sequence > target.sequence && await Dinner.findByIdAndUpdate({_id:item._id},{sequence:item.sequence - 1})
        })
        await Dinner.findByIdAndDelete(req.params.id)
        console.log(`Item Deleted from Database`)
        res.json(`Item Deleted from Database`)
    }catch(err){
        console.log(err)
    }
})
app.get('/api/dinner',async(req,res)=>{
    try{
        const allDinner = await Dinner.find().sort({sequence:1})
        res.json(allDinner)
    }catch(err){
        console.log(err)
    }
})

app.get('/api/dinner/:id', async(req,res)=>{
    try{
        const dinner = await Dinner.findById(req.params.id)
        console.log(dinner)
        res.json(dinner)
    }catch(err){
        console.log(err)
    }
})
app.put('/api/dinner/:id', async(req,res)=>{
    try{
        await Dinner.findByIdAndUpdate({_id:req.params.id},{
            section:req.body.section,
            name:req.body.name,
            allergies:req.body.allergies,
            preDescription:req.body.preDescription,
            description:req.body.description,
            price:req.body.price,
        })
        console.log(`Updated in Database: ${req.body.name}`)
        res.json(`Updated in Database: ${req.body.name}`)
    }catch(err){
        console.log(err)
    }
})
app.put('/api/dinner/up/:id',async(req,res)=>{
    try{
        const target = await Dinner.findById(req.params.id)
        await Dinner.findOneAndUpdate(
            {section:target.section, sequence:target.sequence - 1}, 
            {$set: {sequence:target.sequence}})
        await Dinner.findByIdAndUpdate({_id:req.params.id}, {$set: {sequence:target.sequence - 1}})
        res.json('Item Moved Up')
    }catch(err){
        console.log(err)
    }
})
app.put('/api/dinner/down/:id',async(req,res)=>{
    try{
        const target = await Dinner.findById(req.params.id)
        await Dinner.findOneAndUpdate(
            {section:target.section, sequence:target.sequence + 1},
            {$set: {sequence:target.sequence}}
        )
        await Dinner.findByIdAndUpdate({_id:req.params.id}, {$set: {sequence:target.sequence + 1}})
        res.json('Item Moved Down') 
    }catch(err){
        console.log(err)
    }
})
app.put('/api/dinner/archive/:id',async(req,res)=>{
    try{
        const target = await Dinner.findById(req.params.id)
        const lastInSection = await Dinner.findOne({section:target.section}).sort({sequence:-1})
        const maxSequence = lastInSection.sequence
        for (let i = target.sequence + 1; i <= maxSequence; i++){
            await Dinner.findOneAndUpdate({section:target.section,
                                            sequence:i
                                            },{$set:{sequence:i - 1}})
        }
        await Dinner.findByIdAndUpdate({_id:req.params.id},{$set:{sequence:0}})
        res.json('Item Archived')
    }catch(err){
        console.log(err)
    }
})
app.put('/api/dinner/unarchive/:id',async(req,res)=>{
    try{
        const target = await Dinner.findById(req.params.id)
        const lastInSection = await Dinner.findOne({section:target.section}).sort({sequence:-1})
        const maxSequence = lastInSection.sequence
        await Dinner.findByIdAndUpdate({_id:req.params.id},{$set:{sequence:maxSequence + 1}})
        res.json('Item Unarchived')
    }catch(err){
        console.log(err)
    }
})
app.get('/api/whitespace',async(req,res)=>{
    try{
        let allWhitespace = await Pixel.find()
        if (!allWhitespace[0]) {
            try{
                await Pixel.create({
                    direction:'vertical',
                    pixels:0
                })
                await Pixel.create({
                    direction:'horizontal',
                    pixels:0
                })
                allWhitespace = await Pixel.find()
            }catch(err){
                console.log(err)
            }
        }
        res.json(allWhitespace)
    }catch(err){
        console.log(err)
    }
})
app.put('/api/whitespace/horizontal',async(req,res)=>{
    try{
        await Pixel.findOneAndUpdate({direction:'horizontal'},{pixels:req.body.pixels})
        res.json(req.body.pixels)
    }catch(err){
        console.log(err)
    }
})
app.put('/api/whitespace/vertical', async(req,res)=>{
    try{
        await Pixel.findOneAndUpdate({direction:'vertical'},{pixels:req.body.pixels})
        console.log('incremented vertical pixels')
        res.json(req.body.pixels)
    }catch(err){
        console.log(err)
    }
})