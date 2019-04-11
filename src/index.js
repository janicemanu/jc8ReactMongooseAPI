const express  = require('express')
const port = require('./config')
const cors = require('cors')
const User = require('./models/user')
const Task = require('./models/task')
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

app.post('/users/login', async (req, res) => {// Login user
    const {email, password} = req.body // destruct property

    try {
        const user = await User.findByCredentials(email, password) // Function buatan sendiri, di folder models file user.js
        res.status(200).send(user)
    } catch (e) {
        res.status(201).send(e)
    }
})

app.post('/tasks/:userid', async (req, res) => { // Create tasks by user id
    try {
        const user = await User.findById(req.params.userid) // search user by id
        if(!user){ // jika user tidak ditemukan
            throw new Error("Unable to create task")
        }
        const task = new Task({...req.body, owner: user._id}) // membuat task dengan menyisipkan user id di kolom owner
        user.tasks = user.tasks.concat(task._id) // tambahkan id dari task yang dibuat ke dalam field 'tasks' user yg membuat task
        await task.save() // save task
        await user.save() // save user
        res.status(201).send(task)
    } catch (e) {
        res.status(404).send(e)
    }
})

app.get('/tasks/:userid', async (req, res) => { // Get own tasks
    try {
        // find mengirim dalam bentuk array
       const user = await User.find({_id: req.params.userid})
                    .populate({path:'tasks'}).exec()
        res.send(user[0].tasks)
    } catch (e) {
        
    }
})

app.delete('/tasks', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.body.id})

        if(!task){
            return res.status(404).send("Delete failed")
        }

        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})





app.listen(port, () => console.log("API Running on port" + port))