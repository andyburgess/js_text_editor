define("Lexer", function() {

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
        pattern: RegExp(/((?:[\{\}\[\]\(\)\,\;]))/g),
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

});
