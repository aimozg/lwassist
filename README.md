# Lewd Writer's Assistant (lwassist)

## Add-in for google docs to convert scenarios into ActionScript for CoC

### Header- and indent-based doc structure: 

* Header 2 that ends with '.as' marks a file
* Headers 3-5 are methods
* `// comments` are stripped from the text into generated sources
* Text is wrapped with `outputText()`
* Bold and italic formatting is translated into `<b>` and `<i>`-tags
* `[if something]` are parsed into AS3 branching. `[if (something) ]` left intact
* `[next something]`, `[option 9 "Back" method name]`, `[camp]` add buttons
* `[do something]` translates into a method call.

### Syntax highlighting

* Recognized tags are marked with different font
* Nested tags have different colors
* Strikeout, underline, and background colors are ignored

### Scene-Document as a Model-View for Coder-Writer interaction

* Header 3 `(config)` for API coordination
* `[extends Superclass]`, in which the coder implements the logic
* `[require flag has met npc]`, translates into a `override function get hasMetNpc():Boolean` that simply calls super. 
It silently compiles if the method is present in superclass and screams in red if it does not.
* `[require action give pc a sword]` similarly translates into a `override function givePcASword():void`. 
These methods should be called with `[do give pc a sword]`

## Syntax reference

TBD