$( document ).ready( function() {

  var Editor = (function() {

    var self = $( ".editor" );
    var input = $( ".editor-input" );
    var lines = $( ".editor-lines" );

    var directFocus = function() {
      input.focus();
    };

    var bindEvents = function() {
      self.on( "click", directFocus );
    };

    var init = function() {
      input.attr( "contenteditable", "true" );
      bindEvents();
    };

    return {
      init: init
    };

  })();


  Editor.init();


});

//   editorInput.keypress(function( e ) {
//     inputChanged(e);
//   });
//
// function inputChanged(e) {
//   if(e.which == 13) {
//     e.preventDefault();

//   }
// }

// function countLineBreaks(element) {
//   var count = $( element ).html().split(/[\n\r]/g).length;
//   return count;
// }
