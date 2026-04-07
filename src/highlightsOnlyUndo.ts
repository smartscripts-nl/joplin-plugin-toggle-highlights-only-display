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
                        .replace(/<div class='highlights-only'>/, '')
                        .replace(/<\/div>$/, '')
                        .replace(/<span class="hide-around-highlight">/g, '')
                        .replace(/<\/span><mark/g, '<mark')
                        .replace(/<\/span><\/(p|li)>/g, '</$1>');

                    return html;
                };
            }
        };
    }
};
