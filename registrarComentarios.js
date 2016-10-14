// ==UserScript==
// @name        Registrar tarea
// @namespace   OAS
// @include     http://tuleap.udistrital.edu.co/my/
// @version     1
// @grant       none
// ==/UserScript==

var _miscript = function() {


if(window.location.toString().match(/tuleap.udistrital.edu.co\/my\//gi)){

var comentar = prompt('Desea realizar comentarios? si/no')
console.log(comentar)
if (comentar === 'si'){

var form = jQuery('<form></form>')
var textarea = jQuery('<textarea id="tracker_followup_comment_new" class="user-mention" rows="8" cols="80" name="artifact_followup_comment" wrap="soft"></textarea>')
textarea.val('Comentario de prueba')
form.append(textarea)

jQuery('#widget_plugin_tracker_myartifacts-0-ajax > div > ul > li > a')
  .each(function (i) {
     console.log(this.href)
     //window.open(this.href, '_blank')
     var url = this.href
     peticionGET(url)

   })

}
   

  
}

}

jQuery( document ).ready(_miscript)

function peticionGET(url){
    jQuery.ajax({
        method: 'GET',
        url: url,
        xhr: function() { //http://stackoverflow.com/questions/3372962/can-i-remove-the-x-requested-with-header-from-ajax-requests
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
      .done(function( msg ) {
        console.log(msg)
        window.msg = msg
        var inicio = msg.indexOf('<form action="/plugins/tracker/\?aid=')
        var final = msg.indexOf('</form>', inicio)
        var formulario = msg.substring(inicio, final)
        formulario = jQuery(formulario)
        formulario.find("#tracker_followup_comment_new").val('Comentario de ejemplo')
        
        peticionPOST(url + '&func=artifact-update', formulario)
      });
}

function peticionPOST(url, form){
   jQuery.ajax({
      contentType: 'multipart/form-data',
      method: 'POST',
      url: url,
      data: form.serialize(),
      xhr: function() { //http://stackoverflow.com/questions/3372962/can-i-remove-the-x-requested-with-header-from-ajax-requests
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
      .done(function( msg ) {
      alert( "Data Saved: " + msg )
   })
}
