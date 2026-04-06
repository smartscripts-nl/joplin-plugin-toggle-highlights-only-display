import joplin from 'api';
import {ContentScriptType, SettingItemType, ToastType, ToolbarButtonLocation} from 'api/types';

let scriptIndex = 1;
const dialogs = joplin.views.dialogs;
const alert_duration = 3000;

joplin.plugins.register({
    onStart: async function () {

        // --- CSS laden via Joplin note stylesheet ---
        const installDir = await joplin.plugins.installationDir();
        const noteCssFilePath = installDir + '/highlights-only.css';
        await (joplin as any).window.loadNoteCssFile(noteCssFilePath);

        // --- Settings voor toggle ---
        await joplin.settings.registerSection('highlightsOnlyDisplaySection', {
            label: 'Highlight-only toggler',
            iconName: 'fa fa-eye',
            description: 'Changes in the below settings will only come into effect after restarting Joplin.'
        });

        await joplin.settings.registerSettings({
            highlightsOnlyMode: {
                value: false,
                type: SettingItemType.Bool,
                section: 'highlightsOnlyDisplaySection',
                public: false,
                label: 'Highlight mode'
            }
        });
        await joplin.settings.registerSettings({
            loadUserCSS: {
                value: true,
                type: SettingItemType.Bool,
                section: 'highlightsOnlyDisplaySection',
                public: true,
                label: 'Load my custom CSS',
                description: 'Load custom CSS from highlights-only.css in the Joplin config folder; if this stylesheet exists, of course.'
            }
        });
        await joplin.settings.registerSettings({
            hideHeadings: {
                value: false,
                type: SettingItemType.Bool,
                section: 'highlightsOnlyDisplaySection',
                public: true,
                label: 'Hide headings in higlights-only display mode',
                description: 'If enabled, in highlights-only display mode headings will be hidden also.'
            }
        });
        await joplin.settings.registerSettings({
            activatedMessage: {
                value: 'highlights-only mode ACTIVATED (this will only become visible upon visiting another note)',
                type: SettingItemType.String,
                section: 'highlightsOnlyDisplaySection',
                public: true,
                label: 'Message upon highlights-only mode activation',
            }
        });
        await joplin.settings.registerSettings({
            deactivatedMessage: {
                value: 'highlights-only mode DE-ACTIVATED (this will only become visible upon visiting another note)',
                type: SettingItemType.String,
                section: 'highlightsOnlyDisplaySection',
                public: true,
                label: 'Message upon highlights-only mode de-activation'
            }
        });

        const loadUserCSS = await joplin.settings.value('loadUserCSS');
        if (loadUserCSS) {
            const configDir = await joplin.settings.globalValues(['profileDir']);
            const fs = require('fs');
            if (fs.existsSync(configDir + '/highlights-only.css')) {
                await (joplin as any).window.loadNoteCssFile(configDir + '/highlights-only.css');
            }
        }
        const hideHeadings = await joplin.settings.value('hideHeadings');
        if (hideHeadings) {
            const hideHeadingsFilePath = installDir + '/hide-headings.css';
            await (joplin as any).window.loadNoteCssFile(hideHeadingsFilePath);
        }

        let enabled = await joplin.settings.value('highlightsOnlyMode');
        if (enabled) {
            await joplin.contentScripts.register(
                ContentScriptType.MarkdownItPlugin,
                'highlightView',
                './highlightsOnly.js'
            );
        }
        else {
            await joplin.contentScripts.register(
                ContentScriptType.MarkdownItPlugin,
                'highlightViewUndo',
                './highlightsOnlyUndo.js'
            );
        }

        // --- Toolbar command ---
        await joplin.commands.register({
            name: 'toggleHighlightView',
            label: 'Toggle highlights-only view',
            iconName: 'fa fa-eye',
            execute: async () => {
                enabled = !enabled;
                await joplin.settings.setValue('highlightsOnlyMode', enabled);

                if (enabled) {
                    await joplin.contentScripts.register(
                        ContentScriptType.MarkdownItPlugin,
                        'highlightView' + scriptIndex,
                        './highlightsOnly.js'
                    );
                    const toastMessage = await joplin.settings.value('activatedMessage');
                    await dialogs.showToast({
                        type: ToastType.Success,
                        message: toastMessage,
                        duration: alert_duration,
                    });
                }
                else {
                    await joplin.contentScripts.register(
                        ContentScriptType.MarkdownItPlugin,
                        'highlightViewUndo' + scriptIndex,
                        './highlightsOnlyUndo.js'
                    );
                    const toastMessage = await joplin.settings.value('deactivatedMessage');
                    await dialogs.showToast({
                        type: ToastType.Error,
                        message: toastMessage,
                        duration: alert_duration,
                    });

                }
                scriptIndex = scriptIndex + 1;

                // dit vernietigt de hele tekst van de notitie:
                /*await joplin.commands.execute("textSelectAll");
                await joplin.commands.execute("replaceSelection", "helaas");*/
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
