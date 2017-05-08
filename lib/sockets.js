/* global io */
export const Socket = {
  socket: io(),
  initSocket: function (callback, idhandler, userhandler) {
    this.socket.on('assignment', idhandler)
    this.socket.on('newQuestion', callback)
    this.socket.on('newUser', userhandler)
  },
  ask: function (question) { this.socket.emit('questionAsked', question) }
}
