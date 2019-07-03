import { Document } from "gherkin-ast";

export const read = async (pattern: string): Promise<Document[]> => {
    if (!pattern) {
        throw new Error("[gherkin-io] [read] pattern must be set!");
    }
    return [];
}