jQuery( document ).ready(function() {

  editor = $( ".input-container" );
  input = $( ".input-field" );
  lines = $( ".output-line-numbers" );
  output = $( ".output-field" );

  input.on("keyup", sendToViewer);

  function sendToViewer(e) {
    var text = input.val();
    output.text(text);
    lines.text("");
    var lineCount = output.text().split(/\n/g).length;
    for(var i = 1; i < lineCount + 1; i++) {
      lines.append(i + "\n");
    }
    // for(var i = 1; i < output.text().split(/\n/g).length + 3; i++) {
    //   lines.append(i + "\n");
    // }
  }

});


// var Editor = (function( $ ) {

  //   var input, lines, self, settings;

  //   var defaults = {
  //     input: {
  //       class: "editor-input",
  //       contenteditable: "true"
  //     },
  //     lines: {
  //       class: "editor-lines"
  //     }
  //   };

  //   var directFocus = function() {
  //     input.focus();
  //   };

  //   var inputChanged = function( e ) {

  //   };

  //   var bindEvents = function() {
  //     self.on("click", directFocus);
  //     input.on("keypress", inputChanged);
  //   };

  //   var init = function( options ) {
  //     settings = $.extend( true, {}, defaults, options );

  //     self = $( "#js-text-editor" );

  //     if( !settings.lines.hidden ) {
  //       lines = $( "<div />" )
  //       .attr( settings.lines )
  //       .appendTo( self );
  //     }

  //     input = $( "<div />" )
  //     .attr( settings.input )
  //     .appendTo( self );

  //     bindEvents();
  //   };

  //   return {
  //     init: init
  //   };

  // })( jQuery );


  // Editor.init();
