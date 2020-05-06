(async () => {
  /**
   * Front-page
   */
  let activeEmoji;

  const browseButton = document.querySelector("#let-me-browse");

  browseButton.addEventListener("click", () => {
    document.querySelector("#emoji-frontpage").classList.add("uuuuup-you-go");
    focusEmoji(activeEmoji);
  });

  /**
   * Fetching emojis
   */

  const response = await fetch(`${location.origin}/../emojis.json`, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
  });

  const EMOJIS = await response.json();

  /**
   * Helper function
   */

  const focusEmoji = (el) =>
    document.getElementById(el.name.split(" ").join("_").split("’").join("--")).focus();

  /**
   * Finding emoji if in URL
   */

  const urlEmoji =
    EMOJIS.find((emoji) => `#${emoji.name}` === decodeURI(location.hash)) ||
    EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  if (urlEmoji) {
    if (urlEmoji.hasOwnProperty("emoji")) {
      browseButton.textContent = `Show me my ${urlEmoji.name}-project ${urlEmoji.emoji}`;
    }
    browseButton.classList.remove("transparent");
  }

  activeEmoji = urlEmoji;

  /**
   * Components
   */

  const emojiShowcase = new Reef("#all-emojis", {
    template: function (props) {
      return `${props.emojis
        .map(
          (emoji) =>
            `<span class="emoji-in-showcase" tabindex="0" id="${emoji.name
              // All this mumbo-jumbo is to make the id names better.
              // Change out empty spaces with underscores, and change out apostrophes with --.
              .split(" ")
              .join("_")
              .split("’")
              .join("--")}">${emoji.emoji}</span>`
        )
        .join("")}`;
    },
    data: {
      emojis: EMOJIS,
    },
  });

  emojiShowcase.render();

  const emojiComponent = new Reef("#emoji-result", {
    template: function (props) {
      return `
    <div class="emoji-result-component">
    <h3 id="emoji-name">${props.emoji.name}</h3>
    <h2 id="emoji">${props.emoji.emoji}</h2>
    <section class="project-languages">
      Languages used:
      <span id="languages">${props.emoji.languages.join(", ")}</span>
    </section>
    <p id="project-desc">
      ${props.emoji.project_description}
    </p>
    ${
      props.emoji.project_tips.length > 1
        ? `<p class="project-tips">Tips:
          <span id="tips">${props.emoji.project_tips}</span>
          </p>`
        : ""
    }
  </div>
    `;
    },
    data: {
      emoji: { ...activeEmoji },
    },
  });

  emojiComponent.render();

  const searchComponent = new Reef(".search-engine", {
    template: function (props) {
      return `
      <input list="search-input" name="search-input" id="emoji-search" placeholder="Search for emojis...">
      <datalist id="search-input">
      ${props.emojis.map((emoji) => `<option value="${emoji.name}" tabindex="0">`).join("")}
      </datalist>
      <button>🔍</button>`;
    },
    data: {
      emojis: EMOJIS,
    },
  });

  searchComponent.render();

  /**
   * UX: Rendering the emojis the user selects
   */

  document.querySelector("#all-emojis").addEventListener("click", (e) => {
    if (e.target.className !== "emoji-in-showcase") return;

    activeEmoji = EMOJIS.find(
      (emoji) =>
        emoji.name.toLowerCase() === e.target.id.split("_").join(" ").split("--").join("’").toLowerCase()
    );

    Object.assign(emojiComponent.data.emoji, activeEmoji);

    location.hash = activeEmoji.name;
  });

  /**
   * Choosing a random emoji
   */

  document.querySelector("#lazy").addEventListener("click", () => {
    activeEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    Object.assign(emojiComponent.data.emoji, activeEmoji);

    location.hash = activeEmoji.name;

    focusEmoji(activeEmoji);
  });

  /**
   * Enabling scrolling through emojis with arrow-keys
   */
  document.querySelector("#all-emojis").addEventListener("keydown", (e) => {
    if (e.target.className !== "emoji-in-showcase") return;

    const horisontalStep = 1;
    const verticalStep = 9;

    switch (e.key) {
      case "Tab":
        activeEmoji = EMOJIS.find(
          (emoji) =>
            emoji.name.toLowerCase() === e.target.id.split("_").join(" ").split("--").join("’").toLowerCase()
        );
        activeEmoji = e.shiftKey
          ? EMOJIS[EMOJIS.indexOf(activeEmoji) - 1]
          : EMOJIS[EMOJIS.indexOf(activeEmoji) + 1];
        break;
      case "Enter":
        activeEmoji = EMOJIS.find(
          (emoji) =>
            emoji.name.toLowerCase() === e.target.id.split("_").join(" ").split("--").join("’").toLowerCase()
        );
        break;
      case "ArrowRight":
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
        }
        let emojiRight =
          e.metaKey || e.ctrlKey
            ? EMOJIS[EMOJIS.indexOf(activeEmoji) + horisontalStep * 10]
            : EMOJIS[EMOJIS.indexOf(activeEmoji) + horisontalStep];
        if (!emojiRight) {
          emojiRight = EMOJIS[EMOJIS.length - 1];
        }
        activeEmoji = emojiRight;
        break;
      case "ArrowLeft":
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
        }
        let emojiLeft =
          e.metaKey || e.ctrlKey
            ? EMOJIS[EMOJIS.indexOf(activeEmoji) - horisontalStep * 10]
            : EMOJIS[EMOJIS.indexOf(activeEmoji) - horisontalStep];
        if (!emojiLeft) {
          emojiLeft = EMOJIS[0];
        }
        activeEmoji = emojiLeft;
        break;
      case "ArrowDown":
        e.preventDefault();
        let emojiDown =
          e.metaKey || e.ctrlKey
            ? EMOJIS[EMOJIS.indexOf(activeEmoji) + verticalStep * 10]
            : EMOJIS[EMOJIS.indexOf(activeEmoji) + verticalStep];
        if (!emojiDown) {
          emojiDown = EMOJIS[EMOJIS.length - ((EMOJIS.length - EMOJIS.indexOf(activeEmoji)) % 9)];
        }
        activeEmoji = emojiDown;
        break;
      case "ArrowUp":
        e.preventDefault();
        let emojiUp =
          e.metaKey || e.ctrlKey
            ? EMOJIS[EMOJIS.indexOf(activeEmoji) - verticalStep * 10]
            : EMOJIS[EMOJIS.indexOf(activeEmoji) - verticalStep];
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

  const searchEngine = document.querySelector(".search-engine");
  const inputForm = document.querySelector("#emoji-search");

  searchEngine.addEventListener("submit", (e) => {
    e.preventDefault();

    activeEmoji = EMOJIS.find(
      (emoji) =>
        emoji.emoji === inputForm.value ||
        emoji.tags.includes(inputForm.value) ||
        emoji.aliases.includes(inputForm.value) ||
        emoji.name.toLowerCase() === inputForm.value.toLowerCase()
    );

    if (!activeEmoji) {
      alert("no emoji found");
      return;
    }

    Object.assign(emojiComponent.data.emoji, activeEmoji);
    location.hash = activeEmoji.name;
    focusEmoji(activeEmoji);
  });
})();
