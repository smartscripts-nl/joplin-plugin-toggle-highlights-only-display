const joplin = require('api').default;

let highlightMode = false;

joplin.plugins.register({
    onStart: async function () {

        // Toggle highlight view command
        await joplin.commands.register({
            name: 'toggleHighlightView',
            label: 'Toggle highlight view',
            execute: async () => {
                highlightMode = !highlightMode;

                // Stuur toggle naar viewer
                await joplin.commands.execute('webview.postMessage', {
                    name: 'highlightToggle',
                    message: highlightMode,
                });
            },
        });

        // Toolbar knop toevoegen
        await joplin.views.toolbarButtons.create(
            'toggleHighlightButton',
            'toggleHighlightView',
            'noteToolbar'
        );

        // Content script registreren
        await joplin.contentScripts.register(
            joplin.contentScripts.types.MarkdownItPlugin,
            'highlightView',
            './contentScript.js'
        );
    },
});
