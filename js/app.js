window.onload = function() {



  var Lexer = (function() {

    var language,
      rules,
      regex;

    var getLanguage = function() {

      return language;

    };

    var lex = function(input) {

      var match,
        lexemes = [],
        previousIndex = 0,
        unmatched = input;

      function determineLexeme(match) {

        // For each capturing group in the RegExp object, determine
        // which group was captured by the match, and return the
        // rule's token and lexeme based on the matched group.

        for (var i = 0; i < rules.length; i++) {

          // Since match[0] will always return the full match of the
          // RegExp object's exec() function, the capturing group
          // will be the first defined value after match[0].

          if (match[i + 1] !== undefined) {
            return {
              token: rules[i].token,
              lexeme: match[0]
            };
          }

        }

      }

      function pushUnknown(l) {

        lexemes.push({
          token: "unkown",
          lexeme: l
        });

      }

      while ((match = regex.exec(input))) {

        // If the match.index is not the same as the previousIndex
        // there is a range of unmatched characters, which will
        // be stored in the lexemes array with type unknown.

        if (match.index != previousIndex) {
          pushUnknown(input.substring(previousIndex, match.index));
        }

        lexemes.push(determineLexeme(match));
        unmatched = input.substring(regex.lastIndex);
        previousIndex = regex.lastIndex;

      }

      // Umatched lexemes may still exist after the matches have
      // been removed in the RegExp object's exec() function;
      // this lexeme is pushed to the lexemes array here.

      if (unmatched.length) {
        pushUnknown(unmatched);
      }

      return lexemes;

    };

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

    var init = function() {

      var defaults = {
        language: "JavaScript (default)",
        rules: [{
          token: "comment",
          pattern: RegExp(/((?:\/\/.*$))/g),
        }, {
          token: "string",
          pattern: RegExp(/((?:["'])(?:(?=(?:\\?))(?:\\?).)*?(?:["']))/g),
        }, {
          token: "regular-expression",
          pattern: RegExp(/((?:\/.*\/g?i?m?))/g),
        }, {
          token: "whitespace",
          pattern: RegExp(/([\s])/g),
        }, {
          token: "method",
          pattern: RegExp(/((?:\.)(?:[\w]+)(?=\())/g),
        }, {
          token: "property",
          pattern: RegExp(/((?:\.)(?:[\w]+)(?=\b))/g),
        }, {
          token: "punctuation",
          pattern: RegExp(/((?:[\{\}\[\]\(\)\,]))/g),
        }, {
          token: "literal",
          pattern: RegExp(/((?:\\b)(?:null|true|false)(?=(?:\\b)))/g),
        }, {
          token: "number",
          pattern: RegExp(/([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/g),
        }, {
          token: "object-value",
          pattern: RegExp(/((?:\b)(?:Infinity|NaN|undefined)(?=(?:\b)))/g),
        }, {
          token: "object-function",
          pattern: RegExp(/((?:\b)(?:eval|uneval|isFinite|isNaN|parseFloat|parseInt|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|unescape)(?=(?:\()))/g),
        }, {
          token: "object",
          pattern: RegExp(/((?:\b)(?:Array|Object|Function|Boolean|Symbol|Error|EvalError|InternalError|RangeError|ReferenceError|SyntaxError|TypeError|URIError|Number|Math|Date|String|RegExp)(?=(?:\b)))/g),
        }, {
          token: "operator",
          pattern: RegExp(/((?:\=\=\=|\=\=|\=|\!\=\=|\!\=|\!|\~|\>\>\>\=|\>\>\>|\>\>\=|\>\>|\>\=|\>|<<\=|<<|<\=|<|\+\=|\+\+|\+|\-\=|\-\-|\-|\*\=|\*|\/\=|\/|\%\=|\%|\&\=|\&\&|\&|\^\=|\^|\|\=|\|\||\||\?|\:))/g),
        }, {
          token: "keyword",
          pattern: RegExp(/((?:\b)(?:abstract|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|transient|try|typeof|var|void|volatile|while|with|yield)(?=(?:\b)))/g),
        }, {
          token: "identifier",
          pattern: RegExp(/((?:\b)(?:[\w]+)(?=\b))/g),
        }]
      };

      setOptions(defaults);

    };

    return {
      init: init,
      getLanguage: getLanguage,
      lex: lex,
      setOptions: setOptions
    };

  })();



  var Parser = (function() {

    var options = {
      draw_whitespace: true,
      white_space_character: "\u25AA"
    };

    // Expects an input that contains two properties, token and lexeme.
    // The token property is used to set the element's style via its
    // class and the lexeme will determine the element's content.

    var parse = function(input) {

      var lexeme = input.lexeme,
        spanElement = document.createElement("span"),
        spanText,
        token = input.token;

      if (options.draw_whitespace) {
        lexeme = lexeme.replace(/\s/g, options.white_space_character);
      }

      spanText = document.createTextNode(lexeme);
      spanElement.classList.add(token);
      spanElement.setAttribute("data-token", token);
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

    var editor = {
        container: document.querySelector(".js-text-editor"),
        content: document.querySelector(".editor-content"),
        header: document.querySelector(".editor-header"),
        input: {
          container: document.querySelector(".input-container"),
          field: document.querySelector(".input-field"),
          footer: document.querySelector(".input-footer"),
          header: document.querySelector(".input-header"),
        },
        output: {
          container: document.querySelector(".output-container"),
          field: document.querySelector(".output-field"),
          footer: document.querySelector(".output-footer"),
          gutter: document.querySelector(".output-gutter"),
          header: document.querySelector(".output-header"),
        }
      },
      timeoutID;

    var clearActiveLineIdentifier = function(e) {

      e.currentTarget.classList.remove("active");

    };

    // Clears the timoutID when a user makes a change to the
    // editor's input to keep the editor from processing
    // the input for every single bit of user input.

    var clearInputTimer = function(e) {

      clearTimeout(timeoutID);

    };

    var clearTokenIdentifier = function(e) {

      var output = editor.output.footer.querySelector("#token");

      output.textContent = "No token selected.";

    };

    // This function will take two parameters, t0 and t1, which
    // represent the start time and end time of the editor's
    // formatInput function, and displays the performance
    // data to the user in the editor's output footer.

    var displayPerformance = function(t0, t1) {

      var output = editor.output.footer.querySelector("#exec-time"),
        performance = Math.ceil(t1 - t0);

      output.textContent = "Executed in " + performance + " milliseconds.";

    };

    var displayLexerLanguage = function(language) {

      var output = editor.input.footer.querySelector("#lex-lang");

      output.textContent = "Lexer is setup for " + language + ".";

    };

    var formatInput = function(e) {

      var input = editor.input.field.value,
        lineCount = 0,
        lines = input.split(/\r?\n/g),
        t0,
        t1;

      writeToStorage("js_editor_input", input);

      t0 = performance.now();

      editor.output.field.innerHTML = "";
      editor.output.gutter.textContent = "";

      lines.forEach(function(line) {

        var lineElement = document.createElement("div");

        if (line) {

          var tokens = Lexer.lex(line);

          tokens.forEach(function(token) {

            var tokenElement = Parser.parse(token);

            tokenElement.addEventListener("mouseover", setTokenIdentifier);
            tokenElement.addEventListener("mouseleave", clearTokenIdentifier);
            lineElement.appendChild(tokenElement);
            //console.log("token: '" + token.token + "'' lexeme: '" + token.lexeme + "'");
          });

        } else {
          lineElement.textContent = " ";
        }

        lineElement.classList.add("output-line");
        lineElement.addEventListener("mouseover", setActiveLineIdentifier);
        lineElement.addEventListener("mouseleave", clearActiveLineIdentifier);

        editor.output.field.appendChild(lineElement);
        editor.output.gutter.textContent += (++lineCount) + "\n";

      });

      t1 = performance.now();
      displayLexerLanguage(Lexer.getLanguage());
      displayPerformance(t0, t1);

    };

    var setActiveLineIdentifier = function(e) {

      e.currentTarget.classList.add("active");

    };

    var setInput = function(value) {

      editor.input.field.value = value;
      editor.input.field.focus();
      formatInput();

    };

    // Processes the user's input when a set amount of time
    // has passed since the last executed keydown event.

    var setInputTimer = function(e) {

      clearInputTimer();
      timeoutID = setTimeout(formatInput, 100);

    };

    // Will append the token name to the footer of the output
    // container when the user mouses over the given item.

    var setTokenIdentifier = function(e) {

      var input = e.currentTarget.getAttribute("data-token"),
        output = editor.output.footer.querySelector("#token");

      output.textContent = input.charAt(0).toUpperCase() + input.substring(1) + " token selected.";

    };

    var init = function() {

      var storedInput = loadFromStorage("js_editor_input");

      Lexer.init();
      Parser.init(true);

      editor.input.field.addEventListener("keydown", clearInputTimer);
      editor.input.field.addEventListener("keyup", setInputTimer);
      editor.input.field.addEventListener("paste", setInputTimer);

      setInput(storedInput);

    };

    return {
      init: init,
    };

  })();

  var loadFromStorage = function(item) {

    var storedItem = window.localStorage.getItem(item);

    if (storedItem) {
      return storedItem;
    } else {
      return "";
    }

  };

  var writeToStorage = function(key, value) {

    window.localStorage.setItem(key, value);

  };

  Editor.init();

};
