# Exoedit
A Visual Studio Code extension that helps you edit and manage scripts for Exosite.

## Feature Overview
* Edit widget scripts
* Publish widget scripts to Exosite
* Edit Lua scripts
* Publish Lua scripts to Exosite
* Minify Lua scripts prior to publishing
* Run widgets outside of Exosite (speeds up your widget development)

## Manual
### Get a widget JavaScript or a Lua script for editing
1. Open the command list (by pressing F1 or Ctrl+Shift+P)
2. Select `Exoedit`
3. Select one of the three edit actions. This will prompt you for the source of the script, download it and display it in the editor.

### Upload the current file to Exosite
When you have an open file, you can use Exoedit to upload it to Exosite. **Depending on whether you have previously saved the mapping of the current file to the corresponding artifact on Exosite**, there are two ways for uploading:

#### a) If the mapping has been saved
1. Open the command list (by pressing F1 or Ctrl+Shift+P)
2. Select `Exoedit: Publish`
3. The status bar will indicate when the script has been published.

#### b) If the mapping has not been saved
1. Open the command list (by pressing F1 or Ctrl+Shift+P)
2. Select `Exoedit`
3. Select one of the three upload actions. This will prompt you for the destination of the script.
4. The status bar will indicate when the script has been published.

### Lua script minification
**This feature is only available if you are in [Workspace Mode](./UsageModes) and have opened a mapped widget script.**

You can choose to have Lua scripts minified before they are published to Exosite. To do so, you can set the (optional) `minify` property
of the Lua script's entry in `exoedit.json (see below) to `basic` or `full` (see example above). 
* **`basic`** removes comments and white space at the beginning of lines. Does not remove any lines.
* **`full`** removes all comments, all unnecessary white space (including new line) and gives variables shorter names.

### Run widget outside of Exosite
**This feature is only available if you are in [Workspace Mode](./UsageModes) and have opened a mapped widget script.**

During development and for testing, Exoedit allows you to run widgets (with live or fake data) outside of Exosite.

Here's how it works:
1. Open the command list (by pressing F1 or Ctrl+Shift+P)
2. Select `Exoedit: Run Script`
3. Click on the link that's beeing displayed (Ctrl+Click)
4. Your browser will display a page containing the widget. When you edit and save the widget in vscode, the browser will automatically reload.
5. When you have finished editing the widget, it's best to stop the http server with the command `Exoedit: Stop Widget Server`.

For more information on how to configure the widget to display live or fake data, see [Running Widgets](./RunningWidgets).

## Script Mapping
The mappings of your script files to the corresponding Exosite artifacts, as well as the Exosite domain, are stored in the file `exoedit.json`.

**JSON Example**
```json
{
    "domain": "foodomain.exosite.com",
    "mappings":{
        "lua":{
            "device": [
                { "path": "abc/one.lua", "rid": "abcd1234", "minify": "basic" },
                { "path": "abc/foo.lua", "rid": "foo123", "minify": "full" },
                { "path": "xy/def.lua", "rid": "ghij5678" }
            ]
        },
        "widget": {
            "domain": [
                { "path": "some/script1.js", "id": "1234567" },
                { "path": "script2.js", "id": "8474987", "run": "fake" }
            ],
            "portal": [
                { "path": "foo/barscript.js", "dashboardId": "1234567", "widgetTitle": "This is the title" },
                { "path": "foo/bazscript.js", "dashboardId": "243242", "widgetTitle": "Another title", "run": "fake" }
            ]
        }
    }
}
```

**NOTE: Portal widget scripts are mapped using their title, so the mapping gets broken if you change the widget's title in Exosite.**
