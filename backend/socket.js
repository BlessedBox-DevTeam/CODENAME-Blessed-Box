const socketIO = require('socket.io');

module.exports = function(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
    }
  });

  io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    socket.on('chatMessage', (data) => {
      io.emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
};
