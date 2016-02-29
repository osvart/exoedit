"use strict";

import { createServer, IncomingMessage, ServerResponse, Server } from "http";
import { window, ExtensionContext, workspace } from "vscode";
import { readFile, access } from "fs";
import { join } from "path";
import log from "../log";
import read from "./read";
import portal from "./portal";
import liveReload from "./liveReload";
const mime = require("mime");

const customFilesFolderName = "exoeditCustomFiles";

export function runWidget(path: string, context: ExtensionContext ) {
    const handlers = getHandlers(path, context);
    const server = createServer((request, response) => {
        const handler = handlers.find(hnd => request.url === hnd.url);
        let handle: (request: IncomingMessage, response: ServerResponse) => void;
        if (handler) {
            handle = handler.handle;
        }
        else {
            handle = handleUnknownRequest();
        }

        handle(request, response);
    });
    const stopper = getStopper(server);
    server.listen("8080");

    log("Exoedit Widget Server started listeing on port 8080. Open the url http://localhost:8080");

    return {
        stop: () => {
            server.close();
            stopper();
            log("Exoedit Widget Server stopped");
        }
    };
}

function getHandlers(widgetPath: string, context: ExtensionContext) {
    return [
        { url: "/", handle: serveStaticFileRelative("widgetClient/index.html", "text/html") },
        { url: "/require.js", handle: serveScript("node_modules/requirejs/require.js") },
        { url: "/fetch.js", handle: serveScript("node_modules/whatwg-fetch/fetch.js") },
        { url: "/promise.js", handle: serveScript("node_modules/es6-promise/dist/es6-promise.min.js") },
        { url: "/exositeFake.js", handle: serveScript("widgetClient/out/exositeFake.js") },
        { url: "/liveReload.js", handle: serveScript("widgetClient/out/liveReload.js") },
        { url: "/widget.js", handle: (request: IncomingMessage, response: ServerResponse) => readFile(widgetPath, (err, widgetScript) => {
            response.setHeader("content-type", "text/javascript");
            const newScript = `define('widget', ['require', 'exports', 'exositeFake'], function(require, exports, exositeFake){var read = exositeFake.read; var exoedit_widget_fn = ${widgetScript.toString()};return exoedit_widget_fn;});`;
            response.end(newScript);
        })},
        { url: "/read", handle: read(widgetPath, context) },
        { url: "/portal", handle: portal(widgetPath, context) },
        { url: "/liveReload", handle: liveReload(widgetPath, getCustomFilesFolderPath()) }
    ];

    function serveScript(workspaceRelativePath: string) {
        return serveStaticFileRelative(workspaceRelativePath, "text/javascript");
    }

    function serveStaticFileRelative(workspaceRelativePath: string, contentType: string) {
        return serveStaticFile(context.asAbsolutePath(workspaceRelativePath), contentType);
    }
}

// When calling server.close(), node only prevents new connections. Therefore
// we must keep track of the sockets in order to be able to destroy them to have
// the server really stop immediately.
function getStopper(server: Server) {
    // taken from http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately
    const sockets = {};
    let nextSocketId = 0;
    server.on("connection", function (socket) {
        const socketId = nextSocketId++;
        sockets[socketId] = socket;

        socket.on("close", function () {
            delete sockets[socketId];
        });
    });

    return () => {
        for (let socketId in sockets) {
            console.log("socket", socketId, "destroyed");
            sockets[socketId].destroy();
        }
    };
}


function serveStaticFile(absolutePath: string, contentType: string) {
    return (request: IncomingMessage, response: ServerResponse) => {
        readFile(absolutePath, (err, file) => {
            response.setHeader("content-type", contentType);
            response.end(file);
        });
    };
}

function handleUnknownRequest() {
    return (request: IncomingMessage, response: ServerResponse) => {
        const filePath = join(getCustomFilesFolderPath(), request.url);
        if (access(filePath, err => {
            if (err) {
                response.statusCode = 404;
                response.end("Not found");
                return;
            }

            const contentType = mime.lookup(filePath);
            return serveStaticFile(filePath, contentType)(request, response);
        }));
    };
}

function getCustomFilesFolderPath() {
    return join(workspace.rootPath, customFilesFolderName);
}