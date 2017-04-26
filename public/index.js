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

function postJSON (data, url) {
  var xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText)
      console.log(json)
    }
  }
  xhr.send(data)
}

const qForm = document.getElementById('q-form')
qForm.addEventListener('submit', handleQuestionSubmit)
