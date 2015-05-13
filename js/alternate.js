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

  var dictionary = {
    entry: {
      language: "javascript",
      rules: [{
        key: "strings",
        val: RegExp(/((?:["'])(?:(?=(?:\\?))(?:\\?).)*?(?:["']))/g)
      }, {
        key: "keywords",
        val: RegExp("((?:\\b)(?:" + keywords.join("|") + ")(?=(?:\\b)))", "g")
      }, {
        name: "js-operator",
        val: RegExp(/((?:\+|\-|\*|\/|\%|\>|<|\!|\&|\||\^|\~|\=))/g),
      }, {
        key: "literals",
        val: RegExp("((?:\\b)(?:" + literals.join("|") + ")(?=(?:\\b)))", "g")
      }, {
        key: "numbers",
        val: RegExp(/([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/g)
      }, {
        key: "methods",
        val: RegExp(/((?:\.)(?:[\w]+)(?:\())/g)
      }, {
        key: "whitespace",
        val: RegExp(/([\s])/g)
      }]
    },
  };

  var test = RegExp(dictionary.entry.rules.map(function(elem) {
    return elem.val.source;
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

    function printmatches(matches) {
      for (var i = 0; i < dictionary.entry.rules.length; i++) {
        if (matches[i + 1] !== undefined) {
          console.log("match: " + matches[i + 1] + " type: " + dictionary.entry.rules[i].key);
        }
      }
    }

    function keywordReplace(match, p1, p2, p3) {
      return p1 + "<span class=\"keyword\">" + p2 + "</span>" + p3;
    }

    function methodReplace(match, p1, p2, p3) {
      return p1 + "<span class=\"method\">" + p2 + "</span>" + p3;
    }

    function testReplace(match, p1, p2, p3, p4, p5) {
      //console.log("m: " + match + " p1: " + p1 + " p2: " + p2 + " p3: " + p3 + " p4: " + p4 + " p5: " + p5);
      if (p1) {
        console.log("m: " + match + ", type: string");
      } else if (p2) {
        console.log("m: " + match + ", type: keyword");
      } else if (p3) {
        console.log("m: " + match + ", type: literal");
      } else if (p4) {
        console.log("m: " + match + ", type: method");
      } else if (p5) {
        console.log("m: " + match + ", type: whitespace");
      }
    }

    output.innerHTML = "";

    textSplit.forEach(function(item, index) {

      var lineArray = [];

      var itemSplit = item.split(/(\s|\b)/g);

      var reKeyword = RegExp("(\\b)(" + keywords.join("|") + ")(?=\\b)", "g"),
        reLiteral = RegExp("(\\b)(" + literals.join("|") + ")(?=\\b)", "g"),
        // String method from http://stackoverflow.com/a/171499
        reString = RegExp(/(["'])(?:(?=(\\?))\2.)*?\1/g),
        reMethod = RegExp(/(\.)([\w]+)(\()/g);

      var line = document.createElement("div");
      line.setAttribute("class", "output-line");

      if (item) {
        console.log("=======newline=======");
        var matches;
        while ((matches = test.exec(item))) {
          var match = matches.input.substring(matches.index, test.lastIndex);
          //console.log("m: " + match + " start: " + matches.index + " end: " + test.lastIndex);
          console.log(matches);
          printmatches(matches);
        }

        // itemSplit.forEach(function(innerItem, index) {
        //   if (innerItem) {
        //     if (innerItem.match(test)) {
        //       innerItem.replace(test, testReplace);
        //     }
        //   }
        // });


        //   itemSplit.forEach(function(innerItem, index) {
        //     if (innerItem) {
        //       var spanElement = document.createElement("span");
        //       var textElement = document.createTextNode(innerItem);

        //       spanElement.appendChild(textElement);

        //       if (innerItem.match(reKeyword)) {
        //         if (itemSplit[index - 1] !== "\"") {
        //           spanElement.setAttribute("class", "keyword");
        //         }
        //       }
        //       if (innerItem.match(reMethod)) {
        //         spanElement.setAttribute("class", "method");
        //       }
        //       if (innerItem.match(/\s/g) && drawSpaces === true) {
        //         spanElement.setAttribute("class", "space");
        //         spanElement.innerHTML = "&bull;";
        //       }
        //       line.appendChild(spanElement);
        //     }
        //   });
      } else {
        line.innerHTML = " ";
      }


      //item = item.replace(/( )/g, "<span class=\"space\">&bull;</span>");

      // var line = document.createElement("div");
      // line.setAttribute("class", "output-line");

      // if (item) {
      //   var reKeyword = RegExp("(\\b)(" + keywords.join("|") + ")((?=\\b)(?!\\\"))", "g");
      //   item = item.replace(reKeyword, keywordReplace);

      //   var reMethod = /(\.)([a-zA-Z]+)(\()/g;
      //   item = item.replace(reMethod, methodReplace);

      //   line.innerHTML = item;
      // } else {
      //   line.innerHTML = " ";
      // }

      // line.addEventListener("mouseover", highlightActiveLine);
      // line.addEventListener("mouseout", unhighlightActiveLine);

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


jQuery(document).ready(function() {

  var dictionary = {
    entry: {
      language: "javascript",
      rules: [{
        name: "js-string",
        pattern: RegExp(/((?:["'])(?:(?=(?:\\?))(?:\\?).)*?(?:["']))/g)
      }, {
        name: "js-keyword",
        pattern: RegExp(/((?:\b)(?:abstract|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|transient|try|typeof|var|void|volatile|while|with|yield)(?=(?:\b)))/g)
      }, {
        name: "js-operator",
        pattern: RegExp(/((?:\+|\-|\*|\/|\%|\>|<|\!|\&|\||\^|\~|\=))/g),
      }, {
        name: "js-literal",
        pattern: RegExp(/((?:\\b)(?:null|true|false)(?=(?:\\b)))/g)
      }, {
        name: "js-number",
        pattern: RegExp(/([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/g)
      }, {
        name: "js-method",
        pattern: RegExp(/((?:\.)(?:[\w]+)(?=\())/g)
      }, {
        name: "whitespace",
        pattern: RegExp(/([\s])/g)
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

    function printmatches(matches) {
      for (var i = 0; i < dictionary.entry.rules.length; i++) {
        if (matches[i + 1] !== undefined) {
          console.log("source: '" + matches.input + "' match: '" + matches[i + 1] + "' start: " + matches.index + " end: " + test.lastIndex + " type: " + dictionary.entry.rules[i].name);
        }
      }
    }

    // function convertMatches(matches, source) {
    //   for (var i = 0; i < dictionary.entry.rules.length; i++) {
    //     if (matches[i + 1] !== undefined) {
    //       var prefix = "<span class=\"" + dictionary.entry.rules[i].name + "\">";
    //       var match = matches[i + 1];
    //       var postfix = "</span>";
    //       var replacement = prefix + match + postfix;
    //       var newSource = source.substr(0, matches.index) + replacement + source.substr(test.lastIndex, source.length);
    //       test.lastIndex = test.lastIndex + prefix.length + postfix.length;
    //       console.log(source);
    //       return newSource;
    //     }
    //   }
    // }

    output.innerHTML = "";

    textSplit.forEach(function(item, index) {

      var line = document.createElement("div");
      line.setAttribute("class", "output-line");

      if (item) {
        Lexer.parse(item);
        line.innerHTML = item;
      } else {
        line.innerHTML = " ";
      }

      output.appendChild(line);
    });

  }

  function highlightActiveLine(e) {
    $(e.currentTarget).addClass("active");
  }

  function unhighlightActiveLine(e) {
    $(e.currentTarget).removeClass("active");
  }

  var Lexer = (function() {

    var language,
      rules,
      regex;

    var determineType = function(match) {

      // For each capturing group in the RegExp object, determine
      // which group was captured by the match, and return the
      // rule's name based on the capturing group's index.

      for (var i = 0; i < rules.length; i++) {

        // Since match[0] will always return the full match of the
        // RegExp object's exec() function, the capturing group
        // will be the first defined value after match[0].

        if (match[i + 1] !== undefined) {
          return rules[i].name;
        }

      }

    };

    var lex = function(input) {

      var match,
        previousIndex = 0,
        lexemes = [];

      while ((match = regex.exec(input))) {

        // If the match.index is not the same as the previousIndex
        // there is a range of unmatched characters, which will
        // be stored in the lexemes array with type unknown.

        if (match.index != previousIndex) {

          lexemes.push({
            type: "unknown",
            content: input.substring(previousIndex, match.index)
          });

        }

        lexemes.push({
          type: determineType(match),
          content: match[0]
        });

        previousIndex = regex.lastIndex;

      }

      return lexemes;

    };

    var init = function(options) {

      language = options.language;
      rules = options.rules;

      // The regex variable is a RegExp object that combines all
      // of the individual patterns from the rules object as
      // capturing groups within a single RegExp pattern.

      regex = RegExp(rules.map(function(rule) {
        return rule.pattern.source;
      }).join("|"), "g");

    };

    return {
      init: init,
      lex: lex
    };

  })();

  var Parser = (function() {

    var parse = function() {

    };

    var init = function() {

    };

    return {
      init: init
    };

  })();

// strings - (["'])(?:(?=(\\?))\2.)*?\1

// var floats = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;

// // matches .log(
// var reMethod = /\.[a-zA-Z]+\(/g;
// text.replace(reMethod, methodReplacer("$&"));

// function methodReplacer(text) {
//   var methodName = text.replace(/[\.\(]/, "");
// }


