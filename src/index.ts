import { writeFile } from "fs-extra";
import { fromPaths } from "gherkin";
import { Document, GherkinDocument } from "gherkin-ast";
import { format, FormatOptions } from "gherkin-formatter";
import { sync } from "glob";
import { resolve } from "path";
import { Readable } from "stream";

export { FormatOptions } from "gherkin-formatter";
export { Document } from "gherkin-ast";

const readFile = (path: string): Promise<GherkinDocument> => {
    return new Promise<GherkinDocument>((fulfill, reject) => {
        const stream: Readable = fromPaths([path], {
            includeGherkinDocument: true,
            includePickles: false,
            includeSource: false,
        });
        stream.on("data", fulfill);
        stream.on("error", reject);
    });
}

export const read = async (pattern: string): Promise<Document[]> => {
    if (!pattern) {
        throw new Error("[gherkin-io] [read] pattern must be set!");
    }
    const files: string[] = sync(pattern, {
        dot: true,
        nosort: true,
        matchBase: false,
    });
    if (!files.length) {
        throw new Error(`[gherkin-io] [read] No matching files for the given pattern: ${pattern}`);
    }
    const documents: Document[] = [];
    for (const file of files) {
        try {
            const gDocument: GherkinDocument = await readFile(file);
            documents.push(Document.parse(gDocument));
        } catch (e) {
            console.warn(`[gherkin-io] [read] Not valid feature file: ${file}\n`, e);
        }
    }
    return documents;
}

export const write = async (filePath: string, document: Document, options?: FormatOptions): Promise<void> => {
    if (!filePath) {
        throw new Error("[gherkin-io] [write] path must be set!");
    }
    if (!document) {
        throw new Error("[gherkin-io] [write] document must be set!");
    }
    await writeFile(
        resolve(filePath),
        format(document, options),
        "utf8",
    );
};
