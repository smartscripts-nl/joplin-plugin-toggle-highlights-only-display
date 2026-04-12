

const noteIds = await joplin.workspace.selectedNoteIds();
const noteId = noteIds.length === 1 ? noteIds[0] : null;
if (noteId) {
	const note = await joplin.data.get(['notes', noteId], {fields: ['body']});
	//await joplin.data.put(['notes', noteId], null, {body: note.body});
	// dit vernietigt de hele tekst van de notitie:
	await joplin.commands.execute("textSelectAll");
	await joplin.commands.execute("replaceSelection", note.body);
}

//* Alex: when exporting a module:

		// CSS assets can be added by exporting an `assets` function:
		assets: () => [
			// We can include styles by either referencing a file
			{ name: './assets/style.css' },

			// or including the style sheet inline
			{
				inline: true,
				mime: 'text/css',
				text: `
					/* This CSS class is added by the highlightActiveLineGutter extension: */
					.cm-gutter .cm-activeLineGutter {
						text-decoration: underline;
						color: var(--joplin-color2);
						background-color: var(--joplin-background-color2);
					}
				`,
			},
		],
	};
