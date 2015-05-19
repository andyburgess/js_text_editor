define("Editor", ["Lexer", "Parser"], function(Lexer, Parser) {

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

});
