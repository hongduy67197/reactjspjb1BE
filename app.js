const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const port = 3150

app.listen(port, () => {
    console.log(`serve listen in localhost ${port}`);
})