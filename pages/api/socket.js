import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('emergency', msg => {
        socket.broadcast.emit('emergency', msg)
      })

      socket.on('accept-emergency', msg => {
        socket.broadcast.emit('accept-emergency', msg)
      })
    })

  }
  res.end()
}

export default SocketHandler;