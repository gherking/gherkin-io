import * as fs from "fs-extra";
import * as formatter from "gherkin-formatter";
import { Document, FormatOptions, read, write } from "../src";

describe("gherkin-io", () => {
    describe("read", () => {
        test("should handle missing pattern", async (done) => {
            try {
                // @ts-ignore
                await read();
                done.fail("Did not throw!");
            } catch (e) {
                expect(String(e)).toContain("pattern must be set");
                done();
            }
        });

        test("should handle if no match for pattern", async (done) => {
            try {
                await read("no-file-match");
                done.fail("Did not throw!");
            } catch (e) {
                expect(String(e)).toContain("No matching file");
                done();
            }
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
        test("should handle missing path", async (done) => {
            try {
                // @ts-ignore
                await write();
                done.fail("Did not throw!");
            } catch (e) {
                expect(String(e)).toContain("path must be set");
                done();
            }
        });

        test("should handle missing document", async (done) => {
            try {
                // @ts-ignore
                await write("path");
                done.fail("Did not throw!");
            } catch (e) {
                expect(String(e)).toContain("document must be set");
                done();
            }
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
