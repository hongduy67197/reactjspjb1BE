const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const port = 3150
const Router = require('./router')

app.use('/views', express.static(path.join(__dirname, './views')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use('/', Router)
app.listen(port, () => {
    console.log(`serve listen in localhost ${port}`);
})