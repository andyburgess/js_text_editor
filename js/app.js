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

    var textSplit = text.split(/\n/g);

    console.log(textSplit.join("|"));

    function keywordReplace(match, p1, p2, p3) {
      return p1 + "<span class=\"keyword\">" + p2 + "</span>" + p3;
    }

    function methodReplace(match, p1, p2, p3) {
      return p1 + "<span class=\"method\">" + p2 + "</span>" + p3;
    }

    output.html("");

    textSplit.forEach(function(item, index) {
      var reKeyword = RegExp("(^|\\s)(" + keywords.join("|") + ")((?!\\S)|\\()", "g");
      item = item.replace(reKeyword, keywordReplace);

      var reMethod = /(\.)([a-zA-Z]+)(\()/g;
      item = item.replace(reMethod, methodReplace);

      var line = $("<div />")
        .attr("class", "output-line")
        .html(item);
      line.on("mouseover", highlightActiveLine);
      line.on("mouseout", unhighlightActiveLine);
      output.append(line);
    });

  }

  function highlightActiveLine(e) {
    $(e.currentTarget).addClass("active");
  }

  function unhighlightActiveLine(e) {
    $(e.currentTarget).removeClass("active");
  }

});

// strings - (["'])(?:(?=(\\?))\2.)*?\1

// var floats = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;

// // matches .log(
// var reMethod = /\.[a-zA-Z]+\(/g;
// text.replace(reMethod, methodReplacer("$&"));

// function methodReplacer(text) {
//   var methodName = text.replace(/[\.\(]/, "");
// }


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
