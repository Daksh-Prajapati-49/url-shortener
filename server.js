const express = require('express');
const app = express();
const mongoose = require('mongoose');
// require database connection 
const dbConnect = require("./db/dbConnect");
require('dotenv').config()

// execute database connection 
dbConnect();

const port = process.env.PORT || 3000;
const ShortUrl = require('./models/url')

app.set('view engine','ejs');
app.use(express.urlencoded({ extended : false }))

app.get('/', async (req, res) => {
    const allData = await ShortUrl.find({},{ _id : 0 })
    res.render('index',{ shorturls : allData})
    }
)

app.post('/short' , async (req,res) => {
    const url = req.body.fullurl
    const record = new ShortUrl({
        full : url
    })
    await record.save()
    res.redirect('/')
})

app.get('/:shortid' , async (req,res) => {
    const shortid = req.params.shortid
    const data = await ShortUrl.findOne({short : shortid})

    if(!data){
        res.sendStatus(404)
    }
    
    data.clicks++
    await data.save()
    res.redirect(data.full)

})

mongoose.connection.on('open',()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
        }
    )
})