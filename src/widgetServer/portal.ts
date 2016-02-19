import { IncomingMessage, ServerResponse } from "http";
import { readToEnd, jsonResponse, ensurePost } from "./widgetServerUtilities";
import { getExoeditFile } from "../exoeditFile";
import { workspace } from "vscode";
import log from "./log";

export default function factory(widgetPath: string) {
    return (request: IncomingMessage, response: ServerResponse) => {
        getExoeditFile(workspace.rootPath).then(file => {
            // get mapping for widgetPath
            // get dashboard
            // get widget
            // note: real data can only be fetched for portal widgets, not for domain widgets.
            // find out somehow what data to return

            log("Faking the data for the widget's \"portal\" parameter");
            // TODO: get stuff from exosite and write it to the response
            jsonResponse(response, { clients: [ { dataports: [ { alias: "foobar", data: [[123, "the value"]]} ] }]});
        });
    };
}

interface ReadBody {
    targetResource: string[];
    options: {};
}