import * as fs from "fs-extra";
import * as formatter from "gherkin-formatter";
import { Document, FormatOptions, read, write } from "../src";

describe("gherkin-io", () => {
    describe("read", () => {
        test("should handle missing pattern", async () => {
            // @ts-ignore
            await expect (read()).rejects.toThrow("[gherkin-io] [read] pattern must be set!");
        });

        test("should handle if no match for pattern", async () => {
            await expect (read("no-file-match")).rejects.toThrow("[gherkin-io] [read] No matching files for the given pattern: no-file-match");
        });

        test("should parse feature files", async () => {
            const documents: Document[] = await read("**/test*.feature");
            expect(documents).toHaveLength(2);
            expect(documents[0].uri).toContain("test.feature");
            expect(documents[1].uri).toContain("test2.feature");
        });

        test("should handle if error happens during parse", async () => {
            const documents: Document[] = await read("**/*.feature");
            expect(documents).toHaveLength(2);
            expect(documents[0].uri).toContain("test.feature");
            expect(documents[1].uri).toContain("test2.feature");
        });
    });

    describe("write", () => {
        test("should handle missing path", async () => {
            // @ts-ignore
            await expect (write()).rejects.toThrow("[gherkin-io] [write] path must be set!");
        });

        test("should handle missing document", async () => {
            // @ts-ignore
            await expect (write("path")).rejects.toThrow("[gherkin-io] [write] document must be set!");
        });

        test("should write feature file", async () => {
            jest.spyOn(formatter, "format").mockReturnValue("FEATURE");
            // @ts-ignore
            jest.spyOn(fs, "writeFile").mockResolvedValue();

            const document: Document = new Document("uri");
            const options: FormatOptions = {
                lineBreak: "\r\n",
                indentation: "  ",
            };
            await write("path.feature", document, options);

            expect(formatter.format).toHaveBeenCalledWith(document, options);
            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringMatching(/path\.feature$/),
                "FEATURE",
                "utf8",
            );
        });
    });
});
