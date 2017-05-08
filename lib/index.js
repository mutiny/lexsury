import { Socket } from './sockets'
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
  methods: {
    addNewQuestion: function () {
      this.questions.push({author: this.username, text: this.newQuestionText, votes: 0})
      Socket.ask({author: this.userId, text: this.newQuestionText})
      this.newQuestionText = ''
    },
    updateQuestions: function (newQuestions) {
      this.questions = newQuestions
    },
    setId: function (newId) {
      this.userId = newId
    },
    updateUsers: function (users) {
      this.users = users
    }
  }
})

Socket.initSocket(lex.updateQuestions, lex.setId, lex.updateUsers)
