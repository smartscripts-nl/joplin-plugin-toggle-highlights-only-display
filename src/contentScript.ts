export default function () {
    return {
        plugin: function () {
        },

        assets: function () {
            return [
                {
                    name: 'highlight.css',
                    inline: true,
                    text: `
            /* Alleen markeringen zichtbaar */
            body.highlight-only * {
              visibility: hidden;
            }

            body.highlight-only mark,
            body.highlight-only mark * {
              visibility: visible;
            }

            body.highlight-only mark {
              display: block;      /* elke mark op nieuwe regel */
              margin: 0;           /* marge via pseudo-element */
              background: yellow;  /* optioneel highlightkleur */
              padding: 0.1em 0.2em;
              border-radius: 2px;
            }

            /* witregel tussen markeringen */
            body.highlight-only mark::after {
              content: "";
              display: block;
              height: 1em; /* hoogte witregel */
            }
          `,
                },
                {
                    name: 'highlight.js',
                    inline: true,
                    text: `
            webviewApi.onMessage((message) => {
              if (message.name === 'highlightToggle') {
                if (message.message) {
                  document.body.classList.add('highlight-only');

                  // scroll naar eerste highlight
                  setTimeout(() => {
                    const first = document.querySelector("mark");
                    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 50);

                } else {
                  document.body.classList.remove('highlight-only');
                }
              }
            });
          `,
                },
            ];
        },
    };
}
