const mongoose = require('mongoose');

//destructurin the "Schema" so that we don't have to write "mongosse.Schema" when defining tue schema
const {Schema} = mongoose

//const farmSchema = new mongoose.Schema({
const farmSchema = new Schema({
    name:{
        type: String,
        required: [true, 'farm must have a name']
    },
    city:{
        type: String,
    },
    
    email:{
        type: String,
        required: [true, 'email is required']
    },
    products:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Product' // as we imported "productSchema"'s model called "Product".
        }
    ]
})

//compiling our model
const Farm = new mongoose.model('Farm', farmSchema)

//we will then export the compiled model from this file
module.exports = Farm //we can now import this model in another file and use it there.