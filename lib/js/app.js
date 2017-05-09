import { Socket } from './sockets'
export const App = function () {
  console.log('this is: ' + this)
  Vue.component('question-item', {
    template: `
      <li>
        {{ author }} - {{ qtext }} - {{ votes }}
        <button v-on:click="$emit('remove')">X</button>
      </li>
    `,
    props: ['author', 'qtext', 'votes']
  })
  var lex = new Vue({
    el: '#lex',
    data: {
      username: 'Anonymous', // TODO
      userId: 0, // This initialization is required
      newQuestionText: '',
      questions: [],
      users: {}
    },
    watch: {
      username: function () { if (this.username.trim()) { this.setUsername() } }
    },
    methods: {
      addNewQuestion: function () {
        this.questions.push({author: this.userId, text: this.newQuestionText, votes: 0})
        Socket.ask({author: this.userId, text: this.newQuestionText})
        this.newQuestionText = ''
      },
      updateQuestions: function (newQuestions) {
        this.questions = newQuestions
      },
      setId: function (newId) {
        this.userId = newId
      },
      setUsername: function () {
        Socket.nick(this.username)
      },
      updateUsers: function (users) {
        this.users = users
      }
    }
  })

  // Callbacks are provided to Socket to be invoked upon corresponding events
  Socket.initSocket(lex.updateQuestions, lex.setId, lex.updateUsers)
}
