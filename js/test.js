window.onload = function() {

  var Lexer = (function() {

    var language,
      ready,
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
        lexemes = [],
        previousIndex = 0,
        unmatched = input;

      // The regex variable is a RegExp object that combines all
      // of the individual patterns from the rules object as
      // capturing groups within a single RegExp pattern.

      regex = RegExp(rules.map(function(rule) {
        return rule.pattern.source;
      }).join("|"), "g");

      var pushLexeme = function(t, c) {

        lexemes.push({
          type: t,
          content: c
        });

      };

      while ((match = regex.exec(input))) {

        // If the match.index is not the same as the previousIndex
        // there is a range of unmatched characters, which will
        // be stored in the lexemes array with type unknown.

        if (match.index != previousIndex) {
          pushLexeme("unknown", input.substring(previousIndex, match.index));
        }

        pushLexeme(determineType(match), match[0]);
        unmatched = input.substring(regex.lastIndex);
        previousIndex = regex.lastIndex;

      }

      // Umatched content may still exist after the matches have
      // been removed in the RegExp object's exec() function;
      // this content is pushed to the lexemes array here.

      if (unmatched.length) {
        pushLexeme("unknown", unmatched);
      }

      return lexemes;

    };

    var init = function(options) {

      language = options.language;
      rules = options.rules;

      if (ready) return;

      ready = true;

    };

    return {
      init: init,
      lex: lex
    };

  })();

  var Parser = (function() {

    var drawWhitespace = true,
      ready = false;

    // Expects a lexeme that contains two properties, type and content.
    // The type property is used to set the style of the element via
    // its class and the content will determine the text content.

    var parse = function(input) {

      var content = input.content,
        spanElement = document.createElement("span"),
        spanText,
        type = input.type;

      if (drawWhitespace) {
        content = content.split(" ").join("\u2024");
      }

      spanText = document.createTextNode(content);
      spanElement.setAttribute("class", type);
      spanElement.appendChild(spanText);

      return spanElement;

    };

    var init = function(drawWS) {

      if (ready) return;

      drawWhitespace = drawWS;

      ready = true;

    };

    return {
      init: init,
      parse: parse
    };

  })();

  var Editor = (function() {

    var input = document.querySelector(".input-field"),
      output = document.querySelector(".output-field"),
      timeoutID;

    var options = {
      language: "javascript",
      rules: [{
        pattern: RegExp(/((?:["'])(?:(?=(?:\\?))(?:\\?).)*?(?:["']))/g),
        action: function(input) {

          var lexemes = [],
            splitInput = input.split(" ");

          splitInput.forEach(function(item, index) {

            lexemes.push({
              type: "js-string",
              content: item
            });

            if (index != splitInput.length) {
              lexemes.push({
                type: "whitespace",
                content: " "
              });
            }

          });

          return lexemes;

        }
      }, {
        pattern: RegExp(/((?:\b)(?:abstract|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|transient|try|typeof|var|void|volatile|while|with|yield)(?=(?:\b)))/g),
        action: function(input) {

          var lexeme = {
            type: "js-keyword",
            content: input
          };

          return lexeme;

        }
      }, {
        pattern: RegExp(/((?:\b)(?:Object|Function|Boolean|Symbol|Error|EvalError|InternalError|RangeError|ReferenceError|SyntaxError|TypeError|URIError|Number|Math|Date|String|RegExp)(?=(?:\b)))/g),
        action: function(input) {

          var lexeme = {
            type: "js-object",
            content: input
          };

          return lexeme;

        }
      }, {
        pattern: RegExp(/((?:\b)(?:Infinity|NaN|undefined)(?=(?:\b)))/g),
        action: function(input) {

          var lexeme = {
            type: "js-object-value",
            content: input
          };

          return lexeme;

        }
      }, {
        pattern: RegExp(/((?:\b)(?:eval|uneval|isFinite|isNaN|parseFloat|parseInt|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|unescape)(?=(?:\()))/g),
        action: function(input) {

          var lexeme = {
            type: "js-object-function",
            content: input
          };

          return lexeme;

        }
      }, {
        pattern: RegExp(/((?:\/.*\/g?i?m?))/g),
        action: function(input) {

          var lexeme = {
            type: "js-regex",
            content: input
          };

          return lexeme;

        }
      }, {
        pattern: RegExp(/((?:\+|\-|\*|\/|\%|\>|<|\!|\&|\||\^|\~|\=))/g),
        action: function(input) {

          var lexeme = {
            type: "js-operator",
            content: input
          };

          return lexeme;

        }
      }, {
        pattern: RegExp(/((?:\\b)(?:null|true|false)(?=(?:\\b)))/g),
        action: function(input) {

          var lexeme = {
            type: "js-literal",
            content: input
          };

          return lexeme;

        }
      }, {
        name: "js-number",
        pattern: RegExp(/([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/g),
        action: function(input) {

          var lexeme = {
            type: "js-number",
            content: input
          };

          return lexeme;

        }
      }, {
        name: "js-method",
        pattern: RegExp(/((?:\.)(?:[\w]+)(?=\())/g),
        action: function(input) {

          var lexeme = {
            type: "js-method",
            content: input
          };

          return lexeme;

        }
      }, {
        name: "whitespace",
        pattern: RegExp(/([\s])/g),
        action: function(input) {

          var lexeme = {
            type: "whitespace",
            content: input
          };

          return lexeme;

        }
      }]
    };

    var init = function() {

      Lexer.init(options);
      Parser.init(true);

      input.addEventListener("keyup", processInput);
      input.addEventListener("keydown", cancelTimer);

    };

    function processInput(e) {
      cancelTimer();
      timeoutID = setTimeout(formatInput, 100);
    }

    function cancelTimer(e) {
      clearTimeout(timeoutID);
    }

    function formatInput(e) {
      var text = input.value;

      var textSplit = text.split(/\r?\n/g);

      output.innerHTML = "";

      textSplit.forEach(function(item, index) {

        var line = document.createElement("div");
        line.setAttribute("class", "output-line");

        if (item) {
          var testToken = Lexer.lex(item);
          for (var i = 0; i < testToken.length; i++) {
            var node = Parser.parse(testToken[i]);
            line.appendChild(node);
            // console.log("type: " + testToken[i].type + " content: " + testToken[i].content);
          }
          //line.innerHTML = item;
        } else {
          line.innerHTML = " ";
        }

        output.appendChild(line);
      });

    }

    return {
      init: init
    };

  })();


  Editor.init();


};
