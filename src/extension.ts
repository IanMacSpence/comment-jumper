// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Define the interface for comment prefix
interface CommentPrefix {
	prefix: string;
	offset: number;
}

let markedBookmarkPosition: vscode.Position | null = null;

// This method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {

	//addBookmarkComment
	let disposable = vscode.commands.registerCommand('comment-jumper.addBookmarkComment', addBookmarkComment);
	context.subscriptions.push(disposable);

	// jumpToNext
	let jumpToNextDisposable = vscode.commands.registerCommand('comment-jumper.jumpToNextBookmarkComment', jumpToNextBookmarkComment);
  context.subscriptions.push(jumpToNextDisposable);

	// jumpToPrevious
	let jumpToPrevDisposable = vscode.commands.registerCommand('comment-jumper.jumpToPreviousBookmarkComment', jumpToPreviousBookmarkComment);
  context.subscriptions.push(jumpToPrevDisposable);

	// jumpTo
	let jumpMarkedDisposable = vscode.commands.registerCommand('comment-jumper.jumpToMarkedBookmark', jumpToMarkedBookmark);
	context.subscriptions.push(jumpMarkedDisposable);

	// setMarked
	let setBookmarkDisposable = vscode.commands.registerCommand('comment-jumper.setMarkedBookmarkPosition', setMarkedBookmarkPosition);
	context.subscriptions.push(setBookmarkDisposable);

}

// Comment prefix function
function getCommentPrefix(languageId: string): CommentPrefix {
	const commentPrefixes: { [key: string]: CommentPrefix } = {
			javascript: { prefix: '// @bm!', offset: 0 },
			typescript: { prefix: '// @bm!', offset: 0 },
			python: { prefix: '# @bm!', offset: 0 },
			html: { prefix: '<!-- @bm! -->', offset: -3 },
			css: { prefix: '/* @bm! */', offset: -2 },
			
	};

	return commentPrefixes[languageId] || { prefix: '// @bm!', offset: 0 };
}



/* COMMAND FUNCTIONS */

// ADD BOOKMARK COMMENT
function addBookmarkComment() {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const line = document.lineAt(selection.active.line);
			// get the comment prefix based on the programming language
			const commentInfo = getCommentPrefix(document.languageId);

			// add comment prefix, then set new cursor position
			editor.edit(editBuilder => {
					editBuilder.insert(line.range.end, `${commentInfo.prefix}`);
			}).then(() => {
					const newCursorPosition = line.range.end.translate(0, commentInfo.prefix.length + commentInfo.offset);
					editor.selection = new vscode.Selection(newCursorPosition, newCursorPosition);
			});

		}
}



// Helper function to find bookmark comments
function findBookmarkComment(startLine: number, searchDirection: 'next' | 'previous'): number | null {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
			return null; // No open text editor
	}

	const document = editor.document;
	const totalLines = document.lineCount;
	
	// Determine the step and range based on the direction
	const step = searchDirection === 'next' ? 1 : -1;
	const endLine = searchDirection === 'next' ? totalLines : -1;

	for (let i = startLine; i !== endLine; i += step) {
			if (document.lineAt(i).text.includes('@bm!')) {
					return i; // Found a bookmark comment line
			}
	}

	// If no bookmark found and not starting from the end (or beginning), cycle around
	if ((searchDirection === 'next' && startLine !== 0) || (searchDirection === 'previous' && startLine + 1 !== totalLines)) {
			return findBookmarkComment(searchDirection === 'next' ? 0 : totalLines - 1, searchDirection);
	}

	return null; // No bookmark comment found
}

// JUMP TO NEXT BOOKMARK COMMENT 
function jumpToNextBookmarkComment() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
			return; // No open text editor
	}

	let currentLine = editor.selection.active.line;
	// search for next bookmark comment from next line in forward direction
	const nextBookmarkLine = findBookmarkComment(currentLine + 1, 'next');

	// if bookmark comment found, set new position and scroll into view
	if (nextBookmarkLine !== null) {
			const position = new vscode.Position(nextBookmarkLine, 0);
			editor.selection = new vscode.Selection(position, position);
			editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
	}
}

// JUMP TO PREVIOUS BOOKMARK COMMENT 
function jumpToPreviousBookmarkComment() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
			return; // No open text editor
	}

	let currentLine = editor.selection.active.line;
	// search for next bookmark comment from previous line in backward direction
	const previousBookmarkLine = findBookmarkComment(currentLine - 1, 'previous');
	
	// if bookmark comment found, set new position and scroll into view
	if (previousBookmarkLine !== null) {
			const position = new vscode.Position(previousBookmarkLine, 0);
			editor.selection = new vscode.Selection(position, position);
			editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
	}
}


// JUMP BOOKMARK
function jumpToMarkedBookmarkAndUpdateHistory(newPosition: vscode.Position) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	markedBookmarkPosition = editor.selection.active;
	editor.selection = new vscode.Selection(newPosition, newPosition);
	editor.revealRange(new vscode.Range(newPosition, newPosition), vscode.TextEditorRevealType.InCenter);
}

function jumpToMarkedBookmark() {
	if (markedBookmarkPosition) {
		jumpToMarkedBookmarkAndUpdateHistory(markedBookmarkPosition);
	} else {
		vscode.window.showInformationMessage('No marked bookmark to jump back to.');
	}
}

// SET MARKED BOOKMARK POSITION
function setMarkedBookmarkPosition() {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		markedBookmarkPosition = editor.selection.active;
	}
};

// FUTURE COMMANDS //

// JUMP TO
// REMOVE COMMENT
// REMOVE ALL
// REMOVE @bm! FROM COMMENTS


export function deactivate() {}


