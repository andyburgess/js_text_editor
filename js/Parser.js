define("Parser", function() {

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

});
