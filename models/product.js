const mongoose = require('mongoose');
const Farm = require('./farm');

//using only for the explicit function(s) here, like addProduct
/*port number er por "movieApp" refers to the name of the db to be used..if that db doesn't exist, then new db with
  mentioned name is created */
  mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
      console.log("mongoo connection open!!")
  })
  .catch( err =>{
      console.log("Oh no, mongo connection error...wrong.wtf!!")
      console.log(err)
  })

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name can not be blank']
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    /*
    //CONSTANTS
    const categories = ['fruit', 'vegetable', 'dairy', 'fungi'] //this constant added in index.js
     */
    category:{
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    }
})

//compiling our model
const Product = new mongoose.model('Product', productSchema)

//associating a product object with a firm
const addProduct = async () =>{
    const  farm = await Farm.findOne({name: 'boubazar'})
    const strawberry = await Product.findOne({name: 'strawberry'})
    await farm.products.push(strawberry)
    await farm.save()
}

//way of rendering the full associated object using "populate" when only the id of associated obj had been stored
Farm.findOne({name: 'boubazar'})
    .populate('products') //products is the attribute name of the ref "Product" in farm.js
    //.then(farm => console.log(farm))

//addProduct()


//we will then export the compiled model from this file
module.exports = Product //we can now import this model in another file and use it there.