/*1)express needed to get a server up and running */
const express = require('express') 

/*2)running the express function after importing */
const app = express() 
const path = require('path') //importing path so the we can run this file 4m any directory in cmd

/*COOKIE PARSER */
const cookieParser = require('cookie-parser')
app.use(cookieParser('mysecret'))

/* EXPRESS SESSION */
const session = require('express-session')
//app.use((session('aSecretKeyProllyForEncryption')))
//app.use((session({secret:'aSecretKeyProllyForEncryption'})))
const sessionOptions = {secret:'aSecretKeyProllyForEncryption', resave: false, saveUninitialized: false} 
app.use((session(sessionOptions)))
    
/*6a)the mongoose part of connection */
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true}); //port number er por "movieApp" refers to the 

/*importing method-override to deal with "put" request */
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

/*6b)importing the compiled model we need. So, since that model was in produc.js file inside "model" folder, oi file
  "require" dile prolly oi file er shob exportable jinish ekhane eshe pore which is held/pointed to by the 
  variable we use here. */
const Product = require('./models/product') 
const Farm = require('./models/farm') 
//const User = require('./models/user')
                                                                                            //name of the db to be used
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

/*8)to allow parsing of info from requested body */
app.use(express.urlencoded({extended: true}))
app.use(express.json())

/*no matter what the type of req is, we alsways get this line printed when there's a request now*/
/*app.use(() =>{ //eta morgan middleware er pore dile khali kaj kore coz ekhane "next" use kori nai
                //r morgan middleware a prolly by default "next" dewa ase internally
    console.log('Heyyy')
    //next()
}) */
app.use((req, res, next) =>{ //eta morgan middleware er agey, pore 2 jaigai e kaj kore
    console.log('Heyyy')
    next()
})

/*5)requiring ejs to be able to use it */ 
app.set('view engine', 'ejs') //setting view engine to ejs
                            //we don't have to do require('ejs') as it's done behind the scene by the above line

//looks for html stuffs inside the "views" folder
app.set('views', path.join(__dirname, '/views')) //mane look for 'views'(arg1) folder in the path given in arg2

//CONSTANTS
const categories = ['fruit', 'vegetable', 'dairy', 'fungi']

/*routes */
/*app.get('/products', (req, res) => { //way 1
    Product.find({})
        .then(res =>{
            console.log(res)
        })
        .catch(err =>{
            console.log(err)
        })
        res.send("all products will be here")
}) */

/*MIDDLEWARE */
/*9)using "Morgan" middleware */
const morgan = require('morgan');

/*10)importing our self defined class */
const AppError = require('./AppError')

const { nextTick } = require('process'); //what is this?? eta ki bhule likhsi???
app.use(morgan('tiny'))

//defining our own middleware
app.use((req, res, next) =>{
    req.requestTime = Date.now()  //now, inside of every single route handler, i'll have access to d req time

    //req.method = 'GET' //this will convert all of our request, whether it's get,post,put, delete into "get"
                      //request. this is sth we don't wanna do but it shows the power of middleware
    next()
}) 

/* adding files of routes instead of writing all the routes directly here in index.js and making it messy*/
const shelterRoutes = require('./routes/shelter')
//app.use('/', shelterRoutes) //this middleware gives permission to use the localhost port specified here for these
                           //routes
const adminRoutes = require('./routes/admin')
app.use('/shelters', shelterRoutes)
app.use('/admin', adminRoutes)

/*COOKIES */
app.get('/greet', (req, res) =>{
    console.log(req.cookies)
    const {name} = req.cookies
    res.send(`HEY THERE ${name}`)
})
app.get('/setname', (req, res) =>{
    //here, we are not gonna ask user for a name, rather we will decide on a name for the user nd add to the cookie
    res.cookie('name', 'Steven Gerard')
    res.send('OK, SENDING A COOKIE TO THE REUQESTER FROM THE SERVER')
})
app.get('/signedcookies', (req,res) =>{
    res.cookie('fruit', 'mango', {signed: true}) //this is how we sign a cookie
    res.send('ok, your cookie has been signed')
})
app.get('/verifyfruit', (req, res) =>{
    console.log(req.cookies) //only shows the unsigned cookies
    console.log(req.signedCookies) //shows the signed cookies
    res.send(req.signedCookies)
})

/*...........x................. */

/*express session routes */
app.get('/pageviewcount', (req, res) =>{ //keep track of no of times a page is visited 
    if(req.session.count){ //i.e. if the count object is true or already exist
        req.session.count += 1
    }
    else{
        req.session.count = 1
    }
    res.send(`You have viewed this page ${req.session.count} times`)
})

//another session example
app.get('/register', (req, res) =>{
    const {username = 'Anonymous'} = req.query
    req.session.username = username
    res.redirect('/welcome')
})

app.get('/welcome', (req, res) =>{
    const {username} = req.session
    res.send(`Welcome here ${username}`)
})
/*.........x.............. */

//middleware that gets executed for only requests of specific routes
app.use('/dogs', (req, res, next) =>{
    console.log('this is only printed for requests in "dogs" route. the req could be get,post, whatever but \
the routes has to be "dogs" ')
    next()
})

//authenctication middleware. may include use of things like username, pw
//app.use((req, res, next) =>{
const verifyPassword = (req, res, next) =>{ //a callback function/middleware
    const {password} = req.query
    if(password === 'chickennugget'){
        next()
    }
    else{
        //res.send('Sorry. You need a valid password!')
        throw new Error('Password required/Valid password required.')
    }
}


//in app.get(), we can add multiple middleware functions as argumnets and if each of them have "next()" in it, then
//then the next middleware function from the arguments will get executed
app.get('/secret', verifyPassword, (req, res) =>{
    res.send('one of my secrets is i have fallen in love with a girl whose name starts with S')
})

//a route with syntax error
app.get('/error', (req, res) =>{
    chicken.fly() //chicken is a variable or constant that has not been defined and "fly()" is a function
                 //that does not exist either as well consequently. so, it's error code
})

app.get('/dogs', (req, res) =>{
    res.send('woofff!!')
})

app.get('/', (req, res) =>{
    res.send('HOME PAGE')
})
/*...........x............................ */

/*10b)testing our self defined "Error" class...part of error handling*/
app.get('/admin', (req, res) =>{
    throw new AppError('You are not an admin', 403) //args are msg, status_code. 403 means no permission
                                                  //even though user could be authorized
})


/**......x............... */


/*FARM ROUTES */
//creating farm
app.get('/farms', async (req, res) => { //way2

        const farms = await Farm.find({})
        console.log(farms)    
        //res.send("all products will be here")
        res.render('farms/index', {farms})
})

app.get('/farms/new', (req, res) => { //this route has to be written b4 '/firms/id' such that "new" doesn't get
                                     //considered as an "id"
    //res.render('products/new', {categories})
    res.render('farms/new')
})

app.get('/farms/:id', async (req, res, next) => {
    const {id} = await req.params

    try{
    const farm = await Farm.findById(id)
    //console.log(farm)

    //say no product could be found, then our html page wouldn't render as product doesn't exist..so we try handling
    if(!farm){
    //if(!farm){
        //throw new AppError('no product with that id could be found', 404);
        //next(new AppError('no farm with that id could be found', 404))
        throw new AppError('no product with that id could be found', 404) //we can directly "throw" if we use 
    }                                                                     //try-catch blocl     
     
    else{
        console.log(farm)
        res.render('farms/show', {farm})
    }
    }
    catch(e){
        next(e)
    }
    
})

//editing a farm

app.post('/farms', async(req, res, next) =>{
    //res.send(req.body)

    //here, directly req.body diye object dhukai disi without checking the data formats and attributes
    //which can cause problem. we need to do more handling which we'll do later
    try{
        const newFarm = await new Farm(req.body)
        await newFarm.save()
        await console.log(newFarm)
        await res.redirect(`/farms/${newFarm._id}`) //this id is created by mongo/mongoose
    }
    catch(err){
        next(err)
        //res.send(`making your product: ${newProduct}`)
        //res.send('making your product'
    } 
    
})



/*........xx............ */

/*PRODUCT ROUTES */
app.get('/products', async (req, res) => { //way2
    const {category} = req.query
    if (category){
        const products = await Product.find({category}) //searching objects 4m that satisfy a particular criteria
        //res.render('products/index', {products, category})
        res.render('products/index', {products})
    }

    else{
        const products = await Product.find({}) //searching all objects from a collection
        console.log(products)    
        //res.send("all products will be here")
        res.render('products/index', {products, category: 'All'}) //since category khuje pai nai, so we explicitly giving
                                                                 //a category to allow us to do stuffs in html file                                                
    }
})

//creating product
app.get('/products/new', async (req, res) => {
    //res.render('products/new', {categories})
    res.render('products/new')
})

//post
/*app.post('/products', async(req, res) =>{
    //here, directly req.body diye object dhukai disi without checking the data formats and attributes
    //which can cause problem. we need to do more handling which we'll do later
    const newProduct = new Product(req.body)
    await newProduct.save()
    console.log(newProduct)
    res.redirect(`/products/${newProduct._id}`) //this id is created by mongo/mongoose
    //res.send(`making your product: ${newProduct}`)
    //res.send('making your product'
}) */
//post
app.post('/products', async(req, res, next) =>{
    //here, directly req.body diye object dhukai disi without checking the data formats and attributes
    //which can cause problem. we need to do more handling which we'll do later
    try{
        const newProduct = new Product(req.body)
        await newProduct.save()
        console.log(newProduct)
        res.redirect(`/products/${newProduct._id}`) //this id is created by mongo/mongoose
    }
    catch(err){
        next(err)
        //res.send(`making your product: ${newProduct}`)
        //res.send('making your product'
    }
    
})

/*function to avoid having to repititively write the try-catch code */
function wrapAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const {id} = req.params

    //try{
    const product = await Product.findById(id)

    //say no product could be found, then our html page wouldn't render as product doesn't exist..so we try handling
    if(!product){
        //throw new AppError('no product with that id could be found', 404);
        next(new AppError('no product with that id could be found', 404))
        //throw new AppError('no product with that id could be found', 404)) //we can directly "throw" if we use 
                                                                         //try-catch blocl     
    }
    //}
    //catch(e){
      //  next(e)
    //}
    console.log(product)
    res.render('products/show', {product})
}))

//editing an item from the collection
app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params
    const product = await Product.findById(id)
    //res.render('products/edit', {product, categories}) //categories dile it will give error even if a category 
                                                    //matches coz somehow product.js er baire list banai items
                                                //category match koraleo match dhortese na
    res.render('products/edit', {product})
})

//DELETE
app.delete('/products/:id', async (req, res) => {
    const {id} = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    res.redirect('/products')
})

//updating object using put request, i.e. completely replacing the object
app.put('/products/:id', async (req, res, next) => {
    //console.log(req.body) //checking if request actually came from the form

    /*updating the object in the db */
    const {id} = req.params
    //const product = await Product.findById(id)
    //the 3rd arg does the validation check nd we don't want to hold the old info of the object, we
    //do "new: true" as well
    try{
        const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true} )
        res.redirect(`/products/${product._id}`)
        //res.send('Putt!!')
    }
    catch(err){
        next(err)
    }
})

/*having this middleware at the end such that if we send a request to a route that couldn't be matched,
  this middleware will only get executed in such cases */
app.use((req, res) =>{
    //res.send('NOT FOUND') //e.g. if we give the route '/chickens'
    res.status(404).send('NOT FOUND') //e.g. if we give the route '/chickens'
})

/*.............ERROR HANDLING............*/
//this is executed when route not matched, also when route matched but there were some errors inside that route code
app.use((err, req, res, next) =>{
    console.log('*******************************')
    console.log('*************ERROR************')
    console.log('*******************************')
    //res.status(404).send('OH BOY! THERE HAS BEEN SOME ERROR!!')

    //using our own defined AppError class
    //const {mess}
    //res.status(404).send('OH BOY! THERE HAS BEEN SOME ERROR!!')
    next(err) //calls the express's default error handler or if there any middleware defined by us after it
})

//differentiating mongoose errors(section 42 last video)- we'll come back to it later
app.use((err, req, res, next) =>{
    console.log(err.name)
    next(err)
})

//extension of error handling lead to by "next()"...so eta dile default error message ashbe na express er
app.use((err, req, res, next) =>{
    const {status = 500} = err //if no status code specified for error on that route, then defaul code is given as 
                              //500 as specified.
    const {message = 'sth is wrong but unspecified'} = err
    res.status(status).send(message)
})

/*....................xxxx............. */

/*4a) a)providing a port for the server to run, and b)a callback function */
app.listen(5000, () =>{
    console.log('LISTENING TO PORT 5000!!')
})