const express  = require('express')
const port = require('./config')
const cors = require('cors')
const User = require('./models/user')
require('./config/mongose')


const app = express()
app.use(cors())
app.use(express.json())

app.post('/users', async (req, res) => { // Register user
    const user = new User(req.body) // create user

    try {
        await user.save() // save user
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(e.message)
    }
})

app.post('/users/login', async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findByCredentials(email, password) // Function buatan sendiri
        res.status(200).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})








app.listen(port, () => console.log("API Running on port" + port))