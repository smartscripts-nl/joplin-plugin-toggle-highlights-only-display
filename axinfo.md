

const noteIds = await joplin.workspace.selectedNoteIds();
const noteId = noteIds.length === 1 ? noteIds[0] : null;
if (noteId) {
	const note = await joplin.data.get(['notes', noteId], {fields: ['body']});
	//await joplin.data.put(['notes', noteId], null, {body: note.body});
	// dit vernietigt de hele tekst van de notitie:
	await joplin.commands.execute("textSelectAll");
	await joplin.commands.execute("replaceSelection", note.body);
}
