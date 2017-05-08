/* global io */
export const Socket = {
  socket: io(),
  initSocket: function (callback, idhandler) {
    this.socket.on('assignment', idhandler)
    this.socket.on('newQuestion', callback)
  },
  ask: function (question) { this.socket.emit('questionAsked', question) }
}
