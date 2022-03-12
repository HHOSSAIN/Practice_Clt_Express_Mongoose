const express = require('express')
const router = express.Router() //makes a router object 

/*aim of using router object is to be able to group out similar routes into separate files. So, say some
  routes start with "shelter", some routes start with "dogs". So, we could be putting all the "shelter" routes in
  "shelter" file, dog routes in a "dog" file etc. INSTEAD OF HAVING ALL THE ROUTES IN "index.js" file. */
  //router.get('/shelters', (req, res) =>{
  router.get('/', (req, res) =>{
      res.send('ALL SHELTERS')
  })

  //router.get('/shelters/:id', (req, res) =>{
  router.get('/:id', (req, res) =>{
      res.send('viewing one shelter')
  })

  //router.get('/shelters/:id/edit', (req, res) =>{
  router.get('/:id/edit', (req, res) =>{
      res.send('editing one shelter')
  })

  module.exports = router //eporting router objec after adding various routes to it