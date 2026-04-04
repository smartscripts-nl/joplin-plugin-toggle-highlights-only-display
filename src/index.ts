import joplin from 'api';
import {ContentScriptType, ToolbarButtonLocation} from 'api/types';

let scriptIndex = 1;

joplin.plugins.register({
    onStart: async function () {

        // --- CSS laden via Joplin note stylesheet ---
        const installDir = await joplin.plugins.installationDir();
        const noteCssFilePath = installDir + '/highlights.css';
        await (joplin as any).window.loadNoteCssFile(noteCssFilePath);

        // --- Settings voor toggle ---
        await joplin.settings.registerSection('highlightSection', {
            label: 'Highlight plugin',
            iconName: 'fas fa-highlighter'
        });

        await joplin.settings.registerSettings({
            highlightsOnlyMode: {
                value: false,
                type: 3, // boolean
                section: 'highlightSection',
                public: false,
                label: 'Highlight mode'
            }
        });

        // --- Toolbar command ---
        await joplin.commands.register({
            name: 'toggleHighlightView',
            label: 'Toggle highlights-only view',
            iconName: 'fa fa-eye',
            execute: async () => {
                const current = await joplin.settings.value('highlightsOnlyMode');
                const newValue = !current;
                await joplin.settings.setValue('highlightsOnlyMode', newValue);

                if (newValue) {
                    alert("\nENKEL MARKERINGEN...\n")
                    await joplin.contentScripts.register(
                        ContentScriptType.MarkdownItPlugin,
                        'highlightView' + scriptIndex,
                        './contentScript.js'
                    );
                }
                else {
                    //alert("\nHELE TEKST...\n")
                    await joplin.contentScripts.register(
                        ContentScriptType.MarkdownItPlugin,
                        'highlightViewUndo' + scriptIndex,
                        './contentScriptUndo.js'
                    );
                }
                scriptIndex = scriptIndex + 1;
            }
        });

        // --- Toolbar knop ---
        await joplin.views.toolbarButtons.create(
            'toggleHighlightButton',
            'toggleHighlightView',
            ToolbarButtonLocation.NoteToolbar
        );
    }
});
