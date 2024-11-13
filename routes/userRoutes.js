const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase');
const db = firebase.database();


router.get('/get', (req, res) => {
  db.ref('user').once('value', (snapshot)=>{
    res.send(snapshot.val());
  })
})

router.get('/add', (req, res) => {
  db.ref('user').set({
    name: 'aaaaa',
    password: '123456466545646'
  })
  res.send('add')
})

module.exports = router;