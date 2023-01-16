const express = require('express')
const morgan = require('morgan')
const path = require('path')
const handlebars = require('express-handlebars')
const { deprecate } = require('util')
const app = express()
const port = 3000

// const controller = require('./app/controllers')
const route = require('./routes')

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

//http logger
// app.use(morgan('combined'))

//template engine
app.engine('hbs', handlebars.engine({ 
    extname: '.hbs'
}));
app.set('view engine', 'hbs')  //set sử dụng view là engine handlebars
app.set('views', path.join(__dirname, 'resources', 'views'))

//routes init
route(app)

app.listen(port, () => console.log('Example app listening at http://localhost:',port))