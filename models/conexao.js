
const mongoose = require('mongoose')

mongoose.connect('xxxxx',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('connect'))
    .catch(err => console.log('error'))
