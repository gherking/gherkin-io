import * as fs from "fs-extra";
import { Rule } from "gherkin-ast";
import * as formatter from "gherkin-formatter";
import { Document, FormatOptions, read, write, parse } from "../src";
import { normalize } from "path";

describe("gherkin-io", () => {
    describe("parse", () => {
        test("should handle missing content", async () => {
            // @ts-ignore
            await expect(parse()).rejects.toThrow("Content must be set!");
        });

        test("should handle missing URI", async () => {
            // @ts-ignore
            await expect(parse("Feature: Test")).rejects.toThrow("URI must be set!");
        });

        test("should handle empty content", async () => {
            await expect(parse("", "")).rejects.toThrow("Content must be set!");
        });

        test("should handle empty URI", async () => {
            await expect(parse("Feature: Test", "")).rejects.toThrow("URI must be set!");
        });

        test("should parse feature file with URI", async () => {
            const document: Document = await parse(fs.readFileSync("./tests/data/test.feature", "utf-8"), "uri.feature");
            expect(document.feature.name).toBe('Test');
            expect(document.uri).toBe('uri.feature');
        });
    });

    describe("read", () => {
        test("should handle missing pattern", async () => {
            // @ts-ignore
            await expect(read()).rejects.toThrow("Pattern must be set!");
        });

        test("should handle if no match for pattern", async () => {
            await expect(read("no-file-match")).rejects.toThrow("No matching files for the given pattern: no-file-match");
        });

        test("should parse feature files", async () => {
            const documents: Document[] = await read("tests/**/test*.feature");
            expect(documents).toHaveLength(2);
            expect(documents[0].uri).toContain("test.feature");
            expect(documents[1].uri).toContain("test2.feature");
        });

        test("should handle if error happens during parse", async () => {
            const documents: Document[] = await read("tests/**/*.feature");
            expect(documents).toHaveLength(2);
            expect(documents[0].uri).toContain("test.feature");
            expect(documents[1].uri).toContain("test2.feature");
        });

        test("should handle Rules", async () => {
            const documents: Document[] = await read("tests/**/test*.feature");
            expect(documents).toHaveLength(2);
            expect(documents[0].feature.elements).toHaveLength(1);

            const rule = documents[0].feature.elements[0] as Rule;
            expect(rule.tags[0].toString()).toEqual('@test');
            expect(rule.elements).toHaveLength(3);
        });

        test("should handle normalized path", async () => {
            const documents: Document[] = await read(normalize("tests/**/test*.feature"));
            expect(documents).toHaveLength(2);
            expect(documents[0].uri).toContain("test.feature");
            expect(documents[1].uri).toContain("test2.feature");
        })
    });

    describe("write", () => {
        test("should handle missing path", async () => {
            // @ts-ignore
            await expect(write()).rejects.toThrow("Path must be set!");
        });

        test("should handle missing document", async () => {
            // @ts-ignore
            await expect(write("path")).rejects.toThrow("Document must be set!");
        });

        test("should write feature file", async () => {
            jest.spyOn(formatter, "format").mockReturnValue("FEATURE");
            jest.spyOn(fs, "existsSync").mockReturnValue(true);
            jest.spyOn(fs, "mkdirpSync").mockReturnValue();
            // @ts-ignore
            jest.spyOn(fs, "writeFile").mockResolvedValue();

            const document: Document = new Document("uri");
            const options: FormatOptions = {
                lineBreak: "\r\n",
                indentation: "  ",
            };
            await write("path.feature", document, options);

            expect(formatter.format).toHaveBeenCalledWith(document, options);
            expect(fs.mkdirpSync).not.toHaveBeenCalled();
            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringMatching(/path\.feature$/),
                "FEATURE",
                "utf8",
            );
        });

        test("should write feature file to non-existing folder", async () => {
            jest.spyOn(formatter, "format").mockReturnValue("FEATURE");
            jest.spyOn(fs, "existsSync").mockReturnValue(false);
            jest.spyOn(fs, "mkdirpSync").mockReturnValue();
            // @ts-ignore
            jest.spyOn(fs, "writeFile").mockResolvedValue();

            const document: Document = new Document("uri");
            const options: FormatOptions = {
                lineBreak: "\r\n",
                indentation: "  ",
            };
            await write("folder/path.feature", document, options);

            expect(formatter.format).toHaveBeenCalledWith(document, options);
            expect(fs.mkdirpSync).toHaveBeenCalledWith(expect.stringMatching(/folder$/));
            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringMatching(/folder[\\/]path\.feature$/),
                "FEATURE",
                "utf8",
            );
        });
    });
});
