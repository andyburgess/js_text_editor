jQuery(document).ready(function() {

  var keywords = [
    "await", "break", "case", "class", "catch", "const", "continue", "debugger",
    "default", "delete", "do", "else", "enum", "export", "extends", "finally",
    "for", "function", "if", "implements", "import", "in", "instanceof",
    "interface", "let", "new", "package", "private", "protected",
    "public", "return", "static", "super", "switch", "this",
    "throw", "try", "typeof", "var", "void", "while",
    "with", "yield"
  ];

  var literals = [
    "null", "true", "false"
  ];

  var input = $(".input-field"),
    output = $(".output-field"),
    timeoutID;

  input.on("keyup", processInput);
  input.on("keydown", cancelTimer);

  function processInput(e) {
    cancelTimer();
    timeoutID = setTimeout(formatInput, 100);
  }

  function cancelTimer(e) {
    clearTimeout(timeoutID);
  }

  function formatInput(e) {
    var text = input.val();
    var re = RegExp("\\b(" + keywords.join("|") + ")\\b", "gi");
    text = text.replace(re, "<span class=\"keyword\">$&</span>");
    output.html(text);
  }

});


// var Editor = (function($) {

//     var self, settings;

//     var defaults = {
//       self: {
//         class: ".js-text-editor"
//       }
//     };

//     var elms = [
//       "editor-container",
//         "editor-header",
//         "editor-content",
//           "input-container",
//             "input-header",
//             "input-content",
//               "input-field",
//           "output-container",
//             "output-header",
//             "output-content",
//               "output-gutter",
//               "output-field"
//     ];

//     var bindEvents = function() {

//     };

//     var init = function(options) {
//       settings = $.extend(true, {}, defaults, options);

//       self = $(settings.self.class);
//       console.log(self);

//       bindEvents();
//     };

//     return {
//       init: init
//     };

//   })(jQuery);


//   Editor.init();
