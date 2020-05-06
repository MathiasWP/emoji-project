"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var activeEmoji, browseButton, response, EMOJIS, focusEmoji, urlEmoji, emojiShowcase, emojiComponent, searchComponent, searchEngine, inputForm;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          /**
           * Front-page
           */
          browseButton = document.querySelector("#let-me-browse");
          browseButton.addEventListener("click", function () {
            document.querySelector("#emoji-frontpage").classList.add("uuuuup-you-go");
            focusEmoji(activeEmoji);
          });
          /**
           * Fetching emojis
           */

          _context.next = 4;
          return fetch("".concat(location.origin, "/../emojis.json"), {
            method: "GET",
            mode: "cors",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
            referrerPolicy: "no-referrer"
          });

        case 4:
          response = _context.sent;
          _context.next = 7;
          return response.json();

        case 7:
          EMOJIS = _context.sent;

          /**
           * Helper function
           */
          focusEmoji = function focusEmoji(el) {
            return document.getElementById(el.name.split(" ").join("_").split("’").join("--")).focus();
          };
          /**
           * Finding emoji if in URL
           */


          urlEmoji = EMOJIS.find(function (emoji) {
            return "#".concat(emoji.name) === decodeURI(location.hash);
          }) || EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

          if (urlEmoji) {
            if (urlEmoji.hasOwnProperty("emoji")) {
              browseButton.textContent = "Show me my ".concat(urlEmoji.name, "-project ").concat(urlEmoji.emoji);
            }

            browseButton.classList.remove("transparent");
          }

          activeEmoji = urlEmoji;
          /**
           * Components
           */

          emojiShowcase = new Reef("#all-emojis", {
            template: function template(props) {
              return "".concat(props.emojis.map(function (emoji) {
                return "<span class=\"emoji-in-showcase\" tabindex=\"0\" id=\"".concat(emoji.name // All this mumbo-jumbo is to make the id names better.
                // Change out empty spaces with underscores, and change out apostrophes with --.
                .split(" ").join("_").split("’").join("--"), "\">").concat(emoji.emoji, "</span>");
              }).join(""));
            },
            data: {
              emojis: EMOJIS
            }
          });
          emojiShowcase.render();
          emojiComponent = new Reef("#emoji-result", {
            template: function template(props) {
              return "\n    <div class=\"emoji-result-component\">\n    <h3 id=\"emoji-name\">".concat(props.emoji.name, "</h3>\n    <h2 id=\"emoji\">").concat(props.emoji.emoji, "</h2>\n    <section class=\"project-languages\">\n      Languages used:\n      <span id=\"languages\">").concat(props.emoji.languages.join(", "), "</span>\n    </section>\n    <p id=\"project-desc\">\n      ").concat(props.emoji.project_description, "\n    </p>\n    ").concat(props.emoji.project_tips.length > 1 ? "<p class=\"project-tips\">Tips:\n          <span id=\"tips\">".concat(props.emoji.project_tips, "</span>\n          </p>") : "", "\n  </div>\n    ");
            },
            data: {
              emoji: _objectSpread({}, activeEmoji)
            }
          });
          emojiComponent.render();
          searchComponent = new Reef(".search-engine", {
            template: function template(props) {
              return "\n      <input list=\"search-input\" name=\"search-input\" id=\"emoji-search\" placeholder=\"Search for emojis...\">\n      <datalist id=\"search-input\">\n      ".concat(props.emojis.map(function (emoji) {
                return "<option value=\"".concat(emoji.name, "\" tabindex=\"0\">");
              }).join(""), "\n      </datalist>\n      <button>\uD83D\uDD0D</button>");
            },
            data: {
              emojis: EMOJIS
            }
          });
          searchComponent.render();
          /**
           * UX: Rendering the emojis the user selects
           */

          document.querySelector("#all-emojis").addEventListener("click", function (e) {
            if (e.target.className !== "emoji-in-showcase") return;
            activeEmoji = EMOJIS.find(function (emoji) {
              return emoji.name.toLowerCase() === e.target.id.split("_").join(" ").split("--").join("’").toLowerCase();
            });
            Object.assign(emojiComponent.data.emoji, activeEmoji);
            location.hash = activeEmoji.name;
          });
          /**
           * Choosing a random emoji
           */

          document.querySelector("#lazy").addEventListener("click", function () {
            activeEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
            Object.assign(emojiComponent.data.emoji, activeEmoji);
            location.hash = activeEmoji.name;
            focusEmoji(activeEmoji);
          });
          /**
           * Enabling scrolling through emojis with arrow-keys
           */

          document.querySelector("#all-emojis").addEventListener("keydown", function (e) {
            if (e.target.className !== "emoji-in-showcase") return;
            var horisontalStep = 1;
            var verticalStep = 9;

            switch (e.key) {
              case "Tab":
                activeEmoji = EMOJIS.find(function (emoji) {
                  return emoji.name.toLowerCase() === e.target.id.split("_").join(" ").split("--").join("’").toLowerCase();
                });
                activeEmoji = e.shiftKey ? EMOJIS[EMOJIS.indexOf(activeEmoji) - 1] : EMOJIS[EMOJIS.indexOf(activeEmoji) + 1];
                break;

              case "Enter":
                activeEmoji = EMOJIS.find(function (emoji) {
                  return emoji.name.toLowerCase() === e.target.id.split("_").join(" ").split("--").join("’").toLowerCase();
                });
                break;

              case "ArrowRight":
                if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                }

                var emojiRight = e.metaKey || e.ctrlKey ? EMOJIS[EMOJIS.indexOf(activeEmoji) + horisontalStep * 10] : EMOJIS[EMOJIS.indexOf(activeEmoji) + horisontalStep];

                if (!emojiRight) {
                  emojiRight = EMOJIS[EMOJIS.length - 1];
                }

                activeEmoji = emojiRight;
                break;

              case "ArrowLeft":
                if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                }

                var emojiLeft = e.metaKey || e.ctrlKey ? EMOJIS[EMOJIS.indexOf(activeEmoji) - horisontalStep * 10] : EMOJIS[EMOJIS.indexOf(activeEmoji) - horisontalStep];

                if (!emojiLeft) {
                  emojiLeft = EMOJIS[0];
                }

                activeEmoji = emojiLeft;
                break;

              case "ArrowDown":
                e.preventDefault();
                var emojiDown = e.metaKey || e.ctrlKey ? EMOJIS[EMOJIS.indexOf(activeEmoji) + verticalStep * 10] : EMOJIS[EMOJIS.indexOf(activeEmoji) + verticalStep];

                if (!emojiDown) {
                  emojiDown = EMOJIS[EMOJIS.length - (EMOJIS.length - EMOJIS.indexOf(activeEmoji)) % 9];
                }

                activeEmoji = emojiDown;
                break;

              case "ArrowUp":
                e.preventDefault();
                var emojiUp = e.metaKey || e.ctrlKey ? EMOJIS[EMOJIS.indexOf(activeEmoji) - verticalStep * 10] : EMOJIS[EMOJIS.indexOf(activeEmoji) - verticalStep];

                if (!emojiUp) {
                  emojiUp = EMOJIS[EMOJIS.indexOf(activeEmoji) % 9];
                }

                activeEmoji = emojiUp;
                break;
            }

            if (e.key !== "Tab") {
              Object.assign(emojiComponent.data.emoji, activeEmoji);
              location.hash = activeEmoji.name;
              focusEmoji(activeEmoji);
            }
          });
          /**
           * Enabling the search-form
           */

          searchEngine = document.querySelector(".search-engine");
          inputForm = document.querySelector("#emoji-search");
          searchEngine.addEventListener("submit", function (e) {
            e.preventDefault();
            activeEmoji = EMOJIS.find(function (emoji) {
              return emoji.emoji === inputForm.value || emoji.tags.includes(inputForm.value) || emoji.aliases.includes(inputForm.value) || emoji.name.toLowerCase() === inputForm.value.toLowerCase();
            });

            if (!activeEmoji) {
              alert("no emoji found");
              return;
            }

            Object.assign(emojiComponent.data.emoji, activeEmoji);
            location.hash = activeEmoji.name;
            focusEmoji(activeEmoji);
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();