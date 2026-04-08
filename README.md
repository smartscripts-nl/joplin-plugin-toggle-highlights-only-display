# Toggle highlights-only display Plugin

* With the eye-button which this plugin adds to the Joplin notebar, you can toggle between highlights-only display, or display of the entire note text.
* If a note doesn't contain any highlights at all, the note text will always be shown, even when highlights-only mode should be enabled.
* The plugin has a section in the Joplin settings, _Hilights-only toggler_.
* The plugin uses custom CSS for displaying the highlights-only mode:
```
.highlights-only p:not(:has(mark)), .highlights-only li:not(:has(mark)) {
  display: none;
}

.highlights-only p:has(mark) {
  margin: 1em .8em;
}

.highlights-only li:has(mark) p {
    margin: 0;
    padding: 0;
    text-indent: 0;
}

.highlights-only li:has(mark) {
    list-style: inside;
}

.highlights-only mark {
    display: block;
    border-radius: 4px;
    padding: .5em;
    background: transparent;
    color: rgb(254, 235, 201);
}

.highlights-only li mark {
    display: inline-block;
}

.highlights-only mark a {
    color: orange;
    font-weight: normal;
}

.highlights-only span.hide-around-highlight {
    display: none;
}

/* Status indicator */
.highlights-only::before {
    content: "🖍️️ highlights-only mode activated...";
    display: block;
    background: yellow;
    color: black;
    padding: 4px 8px;
    font-weight: bold;
    margin-bottom: 11px;
    text-align: center;
    border-radius: 4px;
}
```
* You can override this CSS by placing a stylesheet highlights-only.css in the Joplin settings folder, in which you override the above CSS. See below as an example my personal custom CSS, to show the highlighted texts in orange "text balloons":
```
.highlights-only p:not(:has(mark)), .highlights-only li:not(:has(mark)) {
  display: none;
}

.highlights-only p:has(mark) {
  margin: 1em .8em;
}

.highlights-only li:has(mark) {
  padding: 0;
  margin: 0;
  list-style: inside;
  text-indent: 0;
}

.highlights-only li:has(mark) p {
    margin: 0;
    padding: 0;
    text-indent: 0;
}

.highlights-only li::before {
    content: none !important;
    padding-right: 0 !important;
    width: 0 !important;
}

.highlights-only mark {
    display: block;
    border-radius: 4px;
    padding: .5em;
    background: orange;
    color: black;
}

.highlights-only li mark {
    display: inline-block;
}

.highlights-only mark a {
    color: maroon;
    font-weight: normal;
}

.highlights-only span.hide-around-highlight {
    display: none;
}

/* Status indicator */
.highlights-only::before {
    content: none; /* or e.g.: content: "🖍️ highlights-only mode activated...";*/
    display: inline;
    background: yellow;
    color: black;
    padding: 0;
    font-weight: bold;
    margin-bottom: 0;
    text-align: center;
    border-radius: 4px;
}
```
