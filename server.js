// import express from 'express'

// const app = express()

// const PORT = process.env.PORT || 3000
// app.get('/', (req, res) => {
//   res.sendFile('index.html', { root: '.' })
// }
// )

// app.use(express.static('public'))
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
// })

// // socket.io
// import { Server } from 'socket.io'
// const io = new Server(app)
// io.on('connection', (socket) => {
//   console.log('A user connected')

//   socket.on('connected', (msg) => {
//     console.log('A user disconnected')
//     socket.broadcast.emit('connected', msg)
//   })


// })


// Import dependencies
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file


const app = express()
const PORT = process.env.PORT || 3000
// const PORT = process.env.PORT || 5000;

// Serve static files from "public"
app.use(express.static('public'))

// Serve index.html from root
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' })
})

// Create HTTP server and bind to Socket.IO
const server = http.createServer(app)
const io = new Server(server)

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected')

  // Receive and broadcast messages
  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg)
  })

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
  
  
})

// Start server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
