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

const userSchema = new mongoose.Schema({
    username: String,
    age: Number
})

const tweetSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

//compiling our model
const User = new mongoose.model('User', userSchema)
const Tweet = new mongoose.model('Tweet', tweetSchema)

//making an explicit tweet
const makeTweets = async () =>{
    const user = new User({
        username: 'chicken69',
        age: 69
    })
    const tweet1 = new Tweet({
        text: 'i love the chicken position',
        likes: 69,
        //user: user
    })
    tweet1.user = user //only the id will get saved in the db even though it looks like we embedded the whole obj
    user.save()
    tweet1.save()
}

const findTweet = async () =>{
    //const t = await Tweet.findOne({}).populate(user) //populates the the whole user object
    const t = await Tweet.findOne({}).populate('user', 'username' ) //only adds the 'username' attribute 4m user
    console.log(t)
}

//makeTweets()
findTweet()