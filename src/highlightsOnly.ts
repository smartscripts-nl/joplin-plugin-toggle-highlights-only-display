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
                        .replace(/<(p|li)>(.+?)<mark/g, '<$1><span class="hide-around-highlight">$2</span><mark')
                        .replace(/<\/mark>(.+?)<\/(p|li)>/g, '</mark><span class="hide-around-highlight">$1</span></$2>')

                    html = "<div class='highlights-only'>" + html + "</div>";

                    return html;
                };
            }
        };
    }
};
