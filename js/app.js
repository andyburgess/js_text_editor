jQuery(document).ready(function() {

  var keywords = [
    "abstract", "await", "boolean", "break", "byte", "case", "catch", "char",
    "class", "const", "continue", "debugger", "default", "delete", "do",
    "double", "else", "enum", "export", "extends", "final", "finally",
    "float", "for", "function", "goto", "if", "implements", "import",
    "in", "instanceof", "int", "interface", "let", "long", "native",
    "new", "package", "private", "protected", "public", "return",
    "short", "static", "super", "switch", "synchronized", "this",
    "throw", "transient", "try", "typeof", "var", "void",
    "volatile", "while", "with", "yield"
  ];

  var literals = [
    "null", "true", "false"
  ];

  var operators = [
    "\\+", "\\-", "\\*", "\\/", "\\%", "\\>", "\\<", "\\!", "\\&", "\\|", "\\^",
    "\\~", "\\=", "\\\?\\s[a-zA-Z0-9]+\\s\\\:"
  ];

  var dictionary = {
    entry: {
      language: "javascript",
      rules: [{
        name: "strings",
        pattern: RegExp(/((?:["'])(?:(?=(?:\\?))(?:\\?).)*?(?:["']))/g),
        replacement: function(match) {
          return ("<span class=\"string\">" + match + "</span>");
        }
      }, {
        name: "keywords",
        pattern: RegExp("((?:\\b)(?:" + keywords.join("|") + ")(?=(?:\\b)))", "g"),
        replacement: function(match) {
          return ("<span class=\"keyword\">" + match + "</span>");
        }
      }, {
        name: "methods",
        pattern: RegExp(/((?:\.)(?:[\w]+)(?:\())/g),
        replacement: function(match) {
          return ("<span class=\"method\">" + match + "</span>");
        }
      }, {
        name: "operators",
        pattern: RegExp("((?:\\b)(?:" + operators.join("|") + ")(?=(?:\\b)))", "g"),
        replacement: function(match) {
          return ("<span class=\"operators\">" + match + "</span>");
        }
      }, {
        name: "literals",
        pattern: RegExp("((?:\\b)(?:" + literals.join("|") + ")(?=(?:\\b)))", "g"),
        replacement: function(match) {
          return ("<span class=\"literal\">" + match + "</span>");
        }
      }, {
        name: "numbers",
        pattern: RegExp(/([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/g),
        replacement: function(match) {
          return ("<span class=\"number\">" + match + "</span>");
        }
      }, {
        name: "whitespace",
        pattern: RegExp(/([\s])/g),
        replacement: function(match) {
          return ("<span class=\"space\">" + match + "</span>");
        }
      }]
    },
  };

  var test = RegExp(dictionary.entry.rules.map(function(elem) {
    return elem.pattern.source;
  }).join("|"), "g");

  console.log(test);

  var input = $(".input-field"),
    output = document.querySelector(".output-field"),
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

    var drawSpaces = true;

    var textSplit = text.split(/\r?\n/g);

    output.innerHTML = "";

    textSplit.forEach(function(item, index) {

      console.log("=============line start=================");

      var lineArray = [];

      var itemSplit = item.split(/(\s|\b)/g);

      var line = document.createElement("div");
      line.setAttribute("class", "output-line");

      if (item) {
        var match = test.exec(item);
        if (match !== null) {
          for (var i = 0; i < dictionary.entry.rules.length; i++) {
            if (match[i + 1] !== undefined) {
              console.log("name: " + dictionary.entry.rules[i].name + " value: " + match[0] + " pos: " + match.index + " len: " + test.lastIndex);
              //
            }
          }
        }
      } else {
        line.innerHTML = " ";
      }

      output.appendChild(line);

      // var line = $("<div />")
      //   .attr("class", "output-line")
      //   .html(item);
      // line.on("mouseover", highlightActiveLine);
      // line.on("mouseout", unhighlightActiveLine);
      // output.append(line);

    });

  }

  function highlightActiveLine(e) {
    $(e.currentTarget).addClass("active");
  }

  function unhighlightActiveLine(e) {
    $(e.currentTarget).removeClass("active");
  }

});

// var Editor = (function($) {

//     var self, settings;

//     var defaults = {
//       self: {
//         class: ".js-text-editor"
//       }
//     };

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
