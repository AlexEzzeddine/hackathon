client
  .collection('messages')
  .subscribe((messages, changes) => {
    changes.added.forEach(message => {
      $('#chatbox').append($('<div>').text(message.body.text))
    })
  })

$('#input').keyup(e => {
  if (e.which === 13) {
    client
      .collection('messages')
      .newDocument()
      .mutate({ text: $('#input').val() })
    $('#input').val('')
  }
})