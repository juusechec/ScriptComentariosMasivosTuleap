// ==UserScript==
// @name        Registrar Novedad Tarea
// @namespace   OAS
// @include     http://tuleap.udistrital.edu.co/my/*
// @include     http://tuleap.udistrital.edu.co/my/
// @include     https://tuleap.udistrital.edu.co/my/*
// @include     https://tuleap.udistrital.edu.co/my/
// @version     1
// @grant       none
// ==/UserScript==

window._formularios = new Array()

var _miscript = function() {
  //Valido solo para ese dominio en la página "My Personal Page" con el Widget "My Artifacts (Tracker V5) [AS]"
  if (window.location.toString().match(/tuleap.udistrital.edu.co\/my\//gi)) {

    var comentar = prompt('Desea realizar comentarios? si/no')
    console.log(comentar)

    if (comentar === 'si') {

      jQuery('#widget_plugin_tracker_myartifacts-0-ajax > div > ul > li > a')
        .each(function(i) {
          console.log('Task', this.href)
            //window.open(this.href, '_blank')
          var url = this.href
          peticionGET(url, enviarComentarioTask)
        })

    }

  }

}

jQuery(document).ready(_miscript)

function peticionGET(url, listener) {
  jQuery.ajax({
      method: 'GET',
      url: url,
      xhr: function() {
        // http://stackoverflow.com/questions/3372962/can-i-remove-the-x-requested-with-header-from-ajax-requests
        // Get new xhr object using default factory
        var xhr = jQuery.ajaxSettings.xhr();
        // Copy the browser's native setRequestHeader method
        var setRequestHeader = xhr.setRequestHeader;
        // Replace with a wrapper
        xhr.setRequestHeader = function(name, value) {
            // Ignore the X-Requested-With header
            if (name == 'X-Requested-With') return;
            // Otherwise call the native setRequestHeader method
            // Note: setRequestHeader requires its 'this' to be the xhr object,
            // which is what 'this' is here when executed.
            setRequestHeader.call(this, name, value);
          }
          // pass it on to jQuery
        return xhr;
      }
    })
    .done(function(respuestaHTML) {
      listener(respuestaHTML)
    })
}

function enviarComentarioTask(respuestaHTML) {
  var inicio = respuestaHTML.indexOf('<form action="/plugins/tracker/\?aid=')
  var final = respuestaHTML.indexOf('</form>', inicio)
  var formulario = respuestaHTML.substring(inicio, final)
  formulario = jQuery(formulario) // Elemento jQuery 
    // https://css-tricks.com/snippets/html/form-submission-new-window/
  formulario.attr('target', '_blank')

  var titulo = formulario.find('.tracker-hierarchy').text() // título task
  if (titulo === '') { // para kanban task
    titulo = formulario.find('.tracker_artifact_title').text()
  }
  var comentario = prompt('Escriba el comentario para: ' + titulo)

  formulario.find('#tracker_followup_comment_new').val(comentario)

  formulario = formulario[0] // Elemento JS
  ponerEnOnGoing(formulario)

  if (comentario !== '' && comentario !== null) {
    //formulario.submit()
    document.body.append(formulario)
    formulario.elements['submit_and_stay'].click() // for Submit and Stay
    window._formularios.push(formulario)

    formulario = jQuery(formulario)
    var story = formulario.find('.xref-in-title').text() // ex: 'epic #1764 -story #4893 -task #4897 -'
    var inicio = story.indexOf('story #')
    if (inicio > -1) {
      inicio = inicio + 7 // 7 is length 'story #'
      var fin = story.indexOf('-', inicio)
      story = Number(story.substring(inicio, fin)) // between
      descontarPuntosStory(story)
    } else {
      console.log('No Story', story)
    }

  }
}


function descontarPuntosStory(storyNumber) {
  var url = '/plugins/tracker/?aid=' + storyNumber
  console.log('Story', url)
  peticionGET(url, function(respuestaHTML) {
    var inicio = respuestaHTML.indexOf('<form action="/plugins/tracker/\?aid=')
    var final = respuestaHTML.indexOf('</form>', inicio)
    var formulario = respuestaHTML.substring(inicio, final)
    formulario = jQuery(formulario)
      // https://css-tricks.com/snippets/html/form-submission-new-window/
    formulario.attr('target', '_blank')

    var puntosRestantes = Number(formulario.find('.tracker_artifact_field-float > div:nth-child(3) > input').val())

    if (puntosRestantes >= 10) {
      puntosRestantes = puntosRestantes - 10
      formulario.find('.tracker_artifact_field-float > div:nth-child(3) > input').val(String(puntosRestantes))
      console.log('puntosRestantes', puntosRestantes)
      formulario = formulario[0]
      document.body.append(formulario)
      formulario.elements['submit_and_stay'].click()
      window._formularios.push(formulario)
    }

  })
}

function ponerEnOnGoing(formulario){ //Elemento JS!!!
  formulario = jQuery(formulario) // jQuery Element
  var option = formulario.find("option[title='On going']")
  if (option.length === 0){
    option = formulario.find("option[title='On Going']")
  }
  var select = option.parent()
  //select.val("On going").change()
  option.attr('selected','selected')
}
