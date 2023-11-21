# comment-jumper README

VS Code extension that prepends comments with a bm- tag to enable a more efficient way to navigate through your code by jumping between these comments

## Features

1. **Add Bookmark Comment**: Quickly add a bookmark comment to your code with a `bm-` prefix.
2. **Remove Bookmark Comment**: Easily remove a bookmark comment from your code.
3. **Jump to Next/Previous Bookmark Comment**: Navigate through your bookmark comments forward or backward.
4. **Set Marked Bookmark Position**: Manually set the position of a bookmark for easy navigation back to it.
5. **Jump to Marked Bookmark**: Jump back to the marked bookmark. Also sets the current 

> Tip: Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) to access these features quickly.

## Requirements

There are no specific requirements for this extension, just install it and start using.

## Extension Settings

This extension does not contribute any specific settings to VS Code at the moment.

## Known Issues

- Extension uses text.includes('bm-') at times to search for lines of code with the bm tag. This may lead to navigating to lines with this string that aren't comments.
- Can improve how it functions for different languages


## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

- Added basic bookmarking features.
- Implemented navigation between bookmark comments.

---

## Using comment-jumper

1. **Adding a Bookmark**: Place your cursor where you want to add a bookmark and use the 'Add Bookmark Comment' command.
2. **Removing a Bookmark**: Place your cursor on a bookmark comment line and use the 'Remove Bookmark Comment' command.
3. **Navigating Bookmarks**: Use 'Jump to Next/Previous Bookmark Comment' commands to navigate. Use 'Jump to a Specific Bookmark Comment' to search and jump.

## Feedback and Contributions

Your feedback is appreciated! If you find any issues or have suggestions for improvement, please open an issue on the GitHub repository.

