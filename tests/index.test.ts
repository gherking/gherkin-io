import * as fs from "fs-extra";
import { Rule } from "gherkin-ast";
import * as formatter from "gherkin-formatter";
import { Document, FormatOptions, read, write } from "../src";

describe("gherkin-io", () => {
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
        
        test("should handle Rule tags", async () => {
            const documents: Document[] = await read("tests/**/test*.feature");
            expect(documents).toHaveLength(2);
            expect((documents[0].feature.elements[0] as Rule).tags[0].toString()).toEqual('@test')
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
