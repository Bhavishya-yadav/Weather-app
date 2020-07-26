const path = require('path')
const express = require('express')
const hbs= require('hbs')
const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const geocode =require('./utils/geocode.js')

const forecast=require('./utils/forecast.js')

app.set('view engine', 'hbs')
newViewsPath=path.join(__dirname,'../templates/views')
partialsPath=path.join(__dirname,'../templates/partials')
hbs.registerPartials(partialsPath)


app.set('views',newViewsPath)
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Bhavishya Yadav'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Bhavishya Yadav'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Bhavishya Yadav'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'You must provide a address'
        })
    }
    // console.log(req.query.address)
    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({ error })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
    
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/help/*',(req,res)=>{
    res.render('404',{
        errorMessage :'No help article found',
        title: '404',
        name: 'Bhavishya Yadav'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        errorMessage :'My 404 error page',
        title: '404',
        name: 'Bhavishya Yadav'
    })
   
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
