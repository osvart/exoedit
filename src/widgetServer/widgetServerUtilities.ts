"use strict";

import { IncomingMessage, ServerResponse } from "http";

export function readToEnd(request: IncomingMessage): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });

        request.on("end", () => {
            resolve(body);
        });
    });
}

/**
 * Adds the necessary headers, JSON.stringifies the data if it is not a string and adds it to the response.
 */
export function jsonResponse(response: ServerResponse, data: any): void {
    response.statusCode = 200;
    response.setHeader("content-type", "application/json");
    if (typeof data !== "string") {
        data = JSON.stringify(data);
    }
    response.end(data);
}

export function ensurePost(request: IncomingMessage, response: ServerResponse): boolean {
    if (request.method === "POST") return true;

    response.statusCode = 405;
    response.end("Only POST is supported");
    return false;
}