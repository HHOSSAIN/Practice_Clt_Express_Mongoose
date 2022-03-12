const mongoose = require('mongoose');

/*port number er por "movieApp" refers to the name of the db to be used..if that db doesn't exist, then new db with
  mentioned name is created */
  mongoose.connect('mongodb://localhost:27017/userDemo', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
      console.log("mongoo connection open!!")
  })
  .catch( err =>{
      console.log("Oh no, mongo connection error...wrong.wtf!!")
      console.log(err)
  })

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'first name can not be blank']
    },
    lastname:{
        type: String,
        required: [true, 'last name can\'t be blank']
        
    },
    addresses:[{ //mongoose makes a unique id for every obj. so since address is a list of objct, mongoose will make
                //a unique id for each address. if we don't want that we need to turn if off with "false"
        _id: {id: false}, //new line added
        street: {
            type:String,
            required: true
        },
        city: {
            type:String,
            required: true
        },
        state: {
            type:String,
            required: true
        },
        code: {
            type:Number,
            required: true
        }
    }]
})

//compiling our model
const User = new mongoose.model('User', userSchema)

const makeUser = async() =>{
    const u = new User({
        firstname: 'Hasne',
        lastname: 'Hossain',
    })
    u.addresses.push({
        state: 'Victoria',
        city: 'Melbourne',
        code: 3029,
        street: '92 Everton Rd'
    })
    const res = await u.save() //async await diye prolly ensuring save uporer code run howar por e hoy
    console.log(res)
}

const addAddress = async(id) =>{
    const user = await User.findById(id)
    user.addresses.push({
        state: 'Victoria',
        city: 'Melbourne',
        code: 3029,
        street: '9 Craig Close'
    })
    const res = await user.save()
    console.log(res)
}

//makeUser()
//addAddress('6223c3af46eeb6cf28d20cd4')
//we will then export the compiled model from this file
module.exports = User //we can now import this model in another file and use it there.

