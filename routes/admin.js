const express = require('express')
const router = express.Router() //makes a router object 

/*aim of using router object is to be able to group out similar routes into separate files. So, say some
  routes start with "shelter", some routes start with "dogs". So, we could be putting all the "shelter" routes in
  "shelter" file, dog routes in a "dog" file etc. INSTEAD OF HAVING ALL THE ROUTES IN "index.js" file. */

  router.use((req, res, next) =>{
      if(req.query.isAdmin){
          next()
      }
      res.send('SORRY, NOT AN ADMIN')
  })

  //router.get('/shelters', (req, res) =>{
  router.get('/topsecret', (req, res) =>{
      res.send('THIS IS TOP SECRET')
  })

  //router.get('/shelters/:id', (req, res) =>{
  router.get('/deleteall', (req, res) =>{
      res.send('OK, DELETING EVERYTHING')
  })

  module.exports = router //eporting router objec after adding various routes to it