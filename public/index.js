/* global $, Vue, io */
function postJSON (data, url) {
  var xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText)
    }
  }
  xhr.send(data)
}
const handleQuestionSubmit = event => {
  event.preventDefault()
  const author = 'anon'
  const question = document.querySelector('#q-form')[0].value
  if (!question) { return false }
  const data = JSON.stringify({
    author,
    question,
    'votes': 1
  })
  postJSON(data, 'http://localhost:3030/questions')
  document.querySelector('#q-form')[0].value = ''
}

var Sockets = {
  socket: io(),
  /**
 * @description  Initializes websocket listener. Callback is invoked upon new questions
 * @param {domCallback} callback - Invokes with a single argument containing a [] of questions {}
 */
  initSocket: (callback) => { this.socket.on('questionAsked', callback) },
  /**
 * @description Broadcasts a websocket event containing new question
 * @param {object} question
 * @param {string} question.author
 * @param {string} question.text
 */
  ask: (question) => { this.socket.emit('questionAsked', question) }
}
