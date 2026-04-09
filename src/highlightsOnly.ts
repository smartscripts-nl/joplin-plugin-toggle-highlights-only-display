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

                            const inlineElements = [];
                            let newContent = content.replace(/(<(a|em|i|b|strong|u)\b[^>]*>.*?<\/\2>|<(br|img)[^>]*>)/gi, match => {
                                const key = `__ELEM_${inlineElements.length}__`;
                                inlineElements.push(match);
                                return key;
                            });

                            newContent = newContent
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

                            inlineElements.forEach((anchorHtml, index) => {
                                const key = `__ELEM_${index}__`;
                                newContent = newContent.replace(key, anchorHtml);
                            });

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
