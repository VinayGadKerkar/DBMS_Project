const express = require("express");
const apiRouter = require('./routes/index')
const app = express();
const bodyparser = require('body-parser')
const cors = require('cors')

app.use(cors());
app.use(bodyparser.json());
app.use('/api/v1', apiRouter);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
})