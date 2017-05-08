/* global io */
export const Socket = {
  socket: io(),
  initSocket: function (callback) { this.socket.on('newQuestion', callback) },
  ask: function (question) { this.socket.emit('questionAsked', question) }
}
