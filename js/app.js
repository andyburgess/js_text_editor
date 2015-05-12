jQuery(document).ready(function() {

  var options = {
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
  };

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

      var line = document.createElement("div");
      line.setAttribute("class", "output-line");

      if (item) {
        var testToken = Lexer.tokenize(item);
        for (var i = 0; i < testToken.length; i++) {
          console.log("type: " + testToken[i].type + " content: " + testToken[i].content);
        }
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






  var Lexer = (function(options) {

    var language = options.language;

    var rules = options.rules;

    // The regex variable is a RegExp object that combines all
    // of the individual patterns from the rules object as
    // capturing groups within a single RegExp pattern.

    var regex = RegExp(rules.map(function(rule) {
      return rule.pattern.source;
    }).join("|"), "g");

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

    var tokenize = function(text) {
      var match,
        previousIndex = 0,
        tokens = [];

      while ((match = regex.exec(text))) {

        // If the match.index is not the same as the previousIndex
        // there is a range of unmatched characters, which will
        // be stored in the tokens array with type unknown.

        if (match.index != previousIndex) {
          tokens.push({
            type: "unknown",
            content: text.substring(previousIndex, match.index)
          });
        }

        tokens.push({
          type: determineType(match),
          content: match[0]
        });

        previousIndex = regex.lastIndex;

      }

      return tokens;

    };

    return {
      parse: parse
    };

  })(options);

});