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
        pattern: RegExp("((?:\\b)(?:null|true|false)(?=(?:\\b)))", "g")
      }, {
        name: "js-number",
        pattern: RegExp(/([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/g)
      }, {
        name: "js-method",
        pattern: RegExp(/((?:\.)(?:[\w]+)(?:\())/g)
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
          console.log("match: " + matches[i + 1] + " type: " + dictionary.entry.rules[i].name);
        }
      }
    }

    output.innerHTML = "";

    textSplit.forEach(function(item, index) {

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
