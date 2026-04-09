module.exports = {
    default: function (context) {
        return {
            plugin: function (markdownIt) {

                const defaultRender = markdownIt.renderer.render.bind(markdownIt.renderer);

                markdownIt.renderer.render = function (tokens, options, env) {
                    let html = defaultRender(tokens, options, env);

                    //* if no mark elements present, no content change needed:
                    if (!html.includes('<mark')) {
                        if (html.includes("<div class='highlights-only-activated'>")) {
                            return html;
                        }
                        return "<div class='highlights-only-activated'>" + html + '</div>';
                    }

                    html = html.replace(
                        //* don't go past closing tag of p and li elements:
                        /<(p|li)([^>]*)>([\s\S]*?)<\/\1>/g,
                        (match, tag, attrs, content) => {

                            let newContent = content
                                //* BEFORE each <mark>:
                                .replace(
                                    /([^<]*?)<mark/g,
                                    '<span class="hide-around-highlight">$1</span><mark'
                                )
                                //* AFTER each </mark>, up to next <mark>:
                                .replace(
                                    /<\/mark>([^<]*?)(?=<mark|$)/g,
                                    '</mark><span class="hide-around-highlight">$1</span>'
                                );

                            return `<${tag}${attrs}>${newContent}</${tag}>`;
                        }
                    );

                    html = "<div class='highlights-only'>" + html + "</div>";

                    return html;
                };
            }
        };
    }
};
