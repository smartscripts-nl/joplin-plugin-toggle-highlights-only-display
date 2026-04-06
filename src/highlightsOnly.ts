module.exports = {
    default: function (context) {
        return {
            plugin: function (markdownIt) {

                const defaultRender = markdownIt.renderer.render.bind(markdownIt.renderer);

                markdownIt.renderer.render = function (tokens, options, env) {
                    let html = defaultRender(tokens, options, env);

                    // if no mark elements present, no content change needed:
                    if (!html.includes('<mark')) {
                        return html;
                    }

                    html = html
                        .replace(/<p>(.+?)<mark/g, '<p><span class="hide-around-highlight">$1</span><mark')
                        .replace(/<\/mark>(.+?)<\/p>/g, '</mark><span class="hide-around-highlight">$1</span></p>')

                    html = "<div class='highlights-only'>" + html + "</div>";

                    return html;
                };
            }
        };
    }
};
