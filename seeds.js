const mongoose = require('mongoose');

const Product = require('./models/product') 

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("mongoo connection open!!")
    })
    .catch( err =>{
        console.log("Oh no, mongo connection error...wrong.wtf!!")
        console.log(err)
    })

const p = new Product({
    name: 'Ruby Grapefruit',
    price: 1.99,
    category: 'fruit'
})

//list of objects
const p2 = [
    {
        name: 'broccoli',
        price: 2.2,
        category: 'vegetable'
    },
    {
        name: 'watermelon',
        price: 1.5,
        category: 'fruit'
    }
]

/*inserting p2 objects to the db...thing to know about "insertMany()" is that if anything doesn't pass validation,
  nothings gets saved to db from the list */
Product.insertMany(p2)
    .then(res => {
        console.log(res)
    })
    .catch(err =>{
        console.log(err)
    })

//inserting p
p.save()
    .then(p =>{
        console.log(p)
    })
    .catch(e =>{
        console.log(e)
    })
