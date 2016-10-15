// ==UserScript==
// @name        Registrar tarea
// @namespace   OAS
// @include     http://tuleap.udistrital.edu.co/my/
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
      window._abrirEnlaces = prompt('Abrir enlaces después de comentar? si/no')

      jQuery('#widget_plugin_tracker_myartifacts-0-ajax > div > ul > li > a')
        .each(function(i) {
          console.log(this.href)
            //window.open(this.href, '_blank')
          var url = this.href
          peticionGET(url)
        })

    }

  }

}

jQuery(document).ready(_miscript)

function peticionGET(url) {
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
      var inicio = respuestaHTML.indexOf('<form action="/plugins/tracker/\?aid=')
      var final = respuestaHTML.indexOf('</form>', inicio)
      var formulario = respuestaHTML.substring(inicio, final)
      formulario = jQuery(formulario)
        // https://css-tricks.com/snippets/html/form-submission-new-window/
      formulario.attr('target', '_blank')

      var titulo = formulario.find('.tracker-hierarchy').text() // título task
      if (titulo == '') { // para kanban task
        titulo = jQuery('.tracker_artifact_title').text()
      }
      var comentario = prompt('Escriba el comentario para: ' + titulo)

      formulario.find('#tracker_followup_comment_new').val(comentario)

      formulario = formulario[0] // Elemento JS
      document.body.append(formulario)

      formulario.submit()

      //formulario.submit()
      window._formularios.push(formulario)
    });
}
