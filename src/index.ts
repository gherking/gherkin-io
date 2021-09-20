import { writeFile, existsSync, mkdirpSync } from "fs-extra";
import { GherkinStreams } from "@cucumber/gherkin-streams";
import { Document, GherkinDocument } from "gherkin-ast";
import { format, FormatOptions } from "gherkin-formatter";
import { sync } from "glob";
import { resolve, dirname } from "path";
import { Readable } from "stream";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gherkin-io");

export { FormatOptions } from "gherkin-formatter";
export { Document } from "gherkin-ast";

const readFile = (path: string): Promise<GherkinDocument> => {
    debug("readFile(path: %s)", path);
    return new Promise<GherkinDocument>((fulfill, reject) => {
        const stream: Readable = GherkinStreams.fromPaths([path], {
            includeGherkinDocument: true,
            includePickles: false,
            includeSource: false,
        });
        stream.on("data", fulfill);
        stream.on("error", reject);
    });
};

export const read = async (pattern: string): Promise<Document[]> => {
    debug("read(pattern: %s)", pattern);
    if (!pattern) {
        throw new Error("Pattern must be set!");
    }
    const files: string[] = sync(pattern, {
        dot: true,
        nosort: true,
        matchBase: false,
    });
    debug("read -> files: %o", files);
    if (!files.length) {
        throw new Error(`No matching files for the given pattern: ${pattern}`);
    }
    const documents: Document[] = [];
    for (const file of files) {
        try {
            const gDocument: GherkinDocument = await readFile(file);
            documents.push(Document.parse(gDocument));
        } catch (e) {
            console.warn(`Not valid feature file: ${file}\n`, e);
        }
    }
    return documents;
};

export const write = async (filePath: string, document: Document, options?: FormatOptions): Promise<void> => {
    debug("write(filePath: %s, document: %s, options: %o)", filePath, document?.constructor.name, options);
    if (!filePath) {
        throw new Error("Path must be set!");
    }
    if (!document) {
        throw new Error("Document must be set!");
    }
    filePath = resolve(filePath);
    const folder = dirname(filePath);
    if (!existsSync(folder)) {
        mkdirpSync(folder);
    }
    await writeFile(
        resolve(filePath),
        format(document, options),
        "utf8",
    );
};
