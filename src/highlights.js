
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
