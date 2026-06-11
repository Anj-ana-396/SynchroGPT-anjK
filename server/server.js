

///for querySrv ECONNREFUSED error....forcing node to use google dns server
import dns from 'node:dns'; // const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from "./configs/db.js"
import userRouter from "./routes/userRoutes.js"
import chatRouter from "./routes/chatRoutes.js"
import messageRouter from "./routes/messageRoutes.js"

const app = express()

//to connect mongodb database
await connectDB()


// Middleware
app.use(cors())
app.use(express.json())


// Routes
app.get('/', (req, res) => res.send(`Server is Live!`))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)


const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`)
})
