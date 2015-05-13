window.onload = function() {

  var Lexer = (function() {

    var language,
      rules,
      regex;

    var setOptions = function(options) {

      language = options.language;
      rules = options.rules;

      // The regex variable is a RegExp object that combines all
      // of the individual patterns from the rules object as
      // capturing groups within a single RegExp pattern.

      regex = RegExp(rules.map(function(rule) {
        return rule.pattern.source;
      }).join("|"), "g");

    };

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

    var init = function() {

      var defaults = {
        language: "javascript",
        rules: [{
          name: "js-string",
          pattern: RegExp(/((?:["'])(?:(?=(?:\\?))(?:\\?).)*?(?:["']))/g)
        }, {
          name: "js-keyword",
          pattern: RegExp(/((?:\b)(?:abstract|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|transient|try|typeof|var|void|volatile|while|with|yield)(?=(?:\b)))/g)
        }, {
          name: "js-object",
          pattern: RegExp(/((?:\b)(?:Object|Function|Boolean|Symbol|Error|EvalError|InternalError|RangeError|ReferenceError|SyntaxError|TypeError|URIError|Number|Math|Date|String|RegExp)(?=(?:\b)))/g)
        }, {
          name: "js-object-value",
          pattern: RegExp(/((?:\b)(?:Infinity|NaN|undefined)(?=(?:\b)))/g)
        }, {
          name: "js-object-function",
          pattern: RegExp(/((?:\b)(?:eval|uneval|isFinite|isNaN|parseFloat|parseInt|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|unescape)(?=(?:\()))/g)
        }, {
          name: "js-regex",
          pattern: RegExp(/((?:\/.*\/g?i?m?))/g)
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

      setOptions(defaults);

    };

    return {
      init: init,
      lex: lex,
      setOptions: setOptions
    };

  })();

  var Parser = (function() {

    var options = {
      draw_whitespace: true,
      white_space_character: "\u2022"
    };

    // Expects a lexeme that contains two properties, type and content.
    // The type property is used to set the style of the element via
    // its class and the content will determine the text content.

    var parse = function(input) {

      var content = input.content,
        spanElement = document.createElement("span"),
        spanText,
        type = input.type;

      if (options.draw_whitespace) {
        content = content.split(" ").join(options.white_space_character);
      }

      spanText = document.createTextNode(content);
      spanElement.setAttribute("class", type);
      spanElement.appendChild(spanText);

      return spanElement;

    };

    var init = function(draw_whitespace) {

      options.draw_whitespace = draw_whitespace;

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
