$(document).ready(function () {
  $('#btn-link').on('click', function (e) {
    e.preventDefault()
    $.get('/suggest', function (res) {
      $('#project-details').html(res)
    })
  })
})
