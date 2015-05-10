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
        key: "literals",
        val: RegExp("((?:\\b)(?:" + literals.join("|") + ")(?=(?:\\b)))", "g")
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
        var matches;
        while ((matches = test.exec(item))) {
          var matchy = matches.input.substring(matches.index, test.lastIndex);
          console.log("m: " + matchy + " i: " + matches.index + " li: " + test.lastIndex);
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
