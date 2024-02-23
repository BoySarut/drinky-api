const express = require('express');
const cors = require('cors');
const app = express();

const registerRoute = require('./routes/register-route')
const authRoute = require('./routes/auth-route')

const { API_PORT } = process.env
const PORT = process.env.PORT || API_PORT

app.use(cors())
app.use(express.json())



app.use('/register', registerRoute)
app.use('/login', authRoute)




app.listen(PORT,()=> {
console.log(`Server ${PORT}`)
});