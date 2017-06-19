# Lewd Writer's Assistant (lwassist)

Add-in for google docs to convert scenarios into ActionScript for CoC

## Features

### Header- and indent-based doc structure: 

* Header 2 that ends with '.as' marks a file
* Headers 3-5 are methods
* `// comments` are stripped from the text and inserted into generated sources as comments
* Text is wrapped with `outputText()`
* Bold and italic formatting is translated into `<b>` and `<i>`-tags
* `[if something]` are parsed into AS3 branching. `[if (something) ]` left intact
* `[next something]`, `[choice 9 "Back" method name]`, `[camp]` add buttons
* `[do something]` translates into a method call.

### Syntax highlighting

* Recognized tags are marked with different font
* Nested tags have different colors
* Strikeout, underline, and background colors are ignored

### Scene-Document as a Model-View for Coder-Writer interaction

* Header 3 `(config)` for API coordination
* `[extends Superclass]`, in which the coder implements the logic

## Installation

In Google Doc:

1. Menu Tools -> script editor
2. Menu File -> New -> HTML file, name it Sidebar.html
3. Replace Code.gs and Sidebar.html content with respective files from GitHub repository
4. Replace 'Untitled project' with "Lewd Writer's Assistant"
5. Save both files (Ctrl+S)
6. Close script editor and update the Google Doc page
7. Menu Add-ons -> menu there's new submenu, go into it, "show". If it asks for permissions to view and edit this document content, "Allow"

### Hello, World

_(requires already prepared CoC compilation environment)_

8. Create a Header 2 with text `Places/TreasureChest.as`.
9. Create four level 3 headers with following content:  (until (continued) Hello, World)

#### (config)

[extends TrChstController]

#### Encounter

After scouring the area, you fall upon a hidden treasure cache. You may take the gold or distirubute to the [if player.cor<30] peasants [else if player.cor<70] goblins [else] demons [end] for experiene.

Which do you choose? // homm 3 ftw

[choice "1,000 gold" Get Gold]

[choice "500 XP" Get XP]

#### Get Gold

Placeholder text

[do show me the money] // fill inventory with junk 

[camp]

#### Get XP
Placeholder text
[do fight mimic]
 

### (continued) Hello, World  

10. [ Convert ] in the LWA sidebar

11. Create 2 files in CoC `classes/classes/Scenes/Places` folder: `TreasureChest.as` and `TrChstController.as`

12. Copy-paste the generated code from addon to `TreasureChest.as`

13. Replace the `TrChstController.as` with:

```as3
package classes.Scenes.Places {
import classes.BaseContent;
import classes.Scenes.Monsters.Mimic;

public class TrChstController extends BaseContent{
	public function TrChstController() {
	}
	public function showMeTheMoney():void {
		// TODO fill inventory with junk
	}
	public function fightMimic():void {
		startCombat(new Mimic(1));
	}
}
}
```

14. TODO instantiate, call, compile, run, test, rage, sage, report, comment, like, subscribe

(...you see, I really don't want to make it a "learn to mod coc without learning coding". It's a tool for writer &LeftRightArrow; coder interaction)

## Syntax reference TBD

