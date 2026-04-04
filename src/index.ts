import joplin from 'api';
import {ContentScriptType, ToolbarButtonLocation } from 'api/types';

let highlightMode = false;

joplin.plugins.register({
	onStart: async function () {

		//* Toggle highlight view command
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

		//* Toolbar knop toevoegen
		await joplin.views.toolbarButtons.create('toggleHighlightButton', 'toggleHighlightView', ToolbarButtonLocation.NoteToolbar);
		//await joplin.views.toolbarButtons.create('myButton2', 'testCommand2', ToolbarButtonLocation.EditorToolbar);

		//* Content script registreren
		await joplin.contentScripts.register(
			ContentScriptType.MarkdownItPlugin,
			'highlightView',
			'./contentScript.js'
		);
	},
});
