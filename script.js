document.addEventListener("DOMContentLoaded", function ()
{
	const noteContainer = document.getElementById("note-container");
	const newNoteButton = document.getElementById("new-note-button");
	const colorForm = document.getElementById("color-form");
	const colorInput = document.getElementById("color-input");

	let noteColor = localStorage.getItem("noteColor") || "gray"; // Stores the selected note color from the form.

	let noteIdCounter = Number(localStorage.getItem("noteIdCounter")) || 0; // Counter for assigning unique IDs to new notes.

	const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

	for (const savedNote of savedNotes)
	{
		const note = document.createElement("textarea");

		// Restore the saved ID back onto the DOM element
		note.setAttribute("data-note-id", savedNote.id.toString());

		// Restore the saved text back into the textarea
		note.value = savedNote.content;

		// Make it look like a normal note
		note.className = "note";
		note.style.backgroundColor = noteColor;

		// Put it on the page
		noteContainer.appendChild(note);
	}


	function addNewNote ()
	{
		const id = noteIdCounter;
		const content = `Note ${id}`;

		const note = document.createElement("textarea");
		note.setAttribute("data-note-id", id.toString()); // Stores the note ID to its data attribute.
		note.value = content; // Sets the note ID as value.
		note.className = "note"; // Sets a CSS class.
		note.style.backgroundColor = noteColor; // Sets the note's background color using the last selected note color.
		noteContainer.appendChild(note); // Appends it to the note container element as its child.

		noteIdCounter++; // Increments the counter since the ID is used for this note.

		const notes = JSON.parse(localStorage.getItem("notes")) || [];
		notes.push({ id:id, content:content});
		localStorage.setItem("notes", JSON.stringify(notes));

		localStorage.setItem("noteIdCounter", noteIdCounter.toString());
	}

	colorForm.addEventListener("submit", function (event)
	{
		event.preventDefault(); // Prevents the default event.

		const newColor = colorInput.value.trim();  // Removes whitespaces.

		const notes = document.querySelectorAll(".note");
		for (const note of notes)
		{
			note.style.backgroundColor = newColor;
		}

		colorInput.value = ""; // Clears the color input field after from submission.

		noteColor = newColor; // Updates the stored note color with the new selection.

		localStorage.setItem("noteColor", noteColor);
	});

	newNoteButton.addEventListener("click", function ()
	{
		addNewNote();
	});

	document.addEventListener("dblclick", function (event)
	{
		if (event.target.classList.contains("note"))
		{
			const idToDelete = Number(event.target.getAttribute("data-note-id"));
			event.target.remove(); // Removes the clicked note.

			const notes = JSON.parse(localStorage.getItem("notes")) || [];
			const updatedNotes = notes.filter(function (note) {
				return note.id !== idToDelete;
			});
			localStorage.setItem("notes", JSON.stringify(updatedNotes));
		}
	});

	noteContainer.addEventListener("blur", function (event)
	{
		if (event.target.classList.contains("note"))
		{
			const idToUpdate = Number(event.target.getAttribute("data-note-id"));
			const newContent = event.target.value;

			const notes = JSON.parse(localStorage.getItem("notes")) || [];

			for (const note of notes){
				if(note.id === idToUpdate){
					note.content = newContent;
					break;
				}
			}

			localStorage.setItem("notes", JSON.stringify(notes));
		}
	}, true);

	window.addEventListener("keydown", function (event)
	{
		/* Ignores key presses made for color and note content inputs. */
		if (event.target.id === "color-input" || event.target.type === "textarea")
		{
			return;
		}

		/* Adds a new note when the "n" key is pressed. */
		if (event.key === "n" || event.key === "N")
		{
			addNewNote(); // Adds a new note.
		}
	});
});
