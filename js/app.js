jQuery( document ).ready(function() {

  var Editor = (function( $ ) {

    var input, lines, self, settings;

    var defaults = {
      input: {
        class: "editor-input",
        contenteditable: "true"
      },
      lines: {
        class: "editor-lines"
      }
    };

    var directFocus = function() {
      input.focus();
    };

    var inputChanged = function( e ) {
      e.preventDefault();
      input.append(String.fromCharCode(e.which));
    };

    var insertNewLine = function() {
      input.append("\n");
    };

    var bindEvents = function() {
      self.on("click", directFocus);
      input.on("keypress", inputChanged);
    };

    var init = function( options ) {
      settings = $.extend( true, {}, defaults, options );

      self = $( "#js-text-editor" );

      if( !settings.lines.hidden ) {
        lines = $( "<div />" )
        .attr( settings.lines )
        .appendTo( self );
      }

      input = $( "<div />" )
      .attr( settings.input )
      .appendTo( self );

      bindEvents();
    };

    return {
      init: init
    };

  })( jQuery );


  Editor.init();


});
