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
    username: '', // TODO
    newQuestionText: '',
    questions: []
  },
  methods: {
    addNewQuestion: function () {
      Socket.ask({author: 'testAuthor', text: this.newQuestionText})
      this.questions.push({author: 'testAuthor', text: this.newQuestionText, votes: 0})
      this.newQuestionText = ''
    },
    updateQuestions: function (newQuestions) {
      this.questions = newQuestions
    }
  }
})

Socket.initSocket(lex.updateQuestions)
