# gherkin-io

![Downloads](https://img.shields.io/npm/dw/gherkin-io?style=flat-square)
![Version@npm](https://img.shields.io/npm/v/gherkin-io?label=version%40npm&style=flat-square)
![Version@git](https://img.shields.io/github/package-json/v/gherking/gherkin-io/master?label=version%40git&style=flat-square)
![CI](https://img.shields.io/github/actions/workflow/status/gherking/gherkin-io/ci.yml?branch=master&label=ci&style=flat-square)
![Docs](https://img.shields.io/github/actions/workflow/status/gherking/gherkin-io/docs.yml?branch=master&label=docs&style=flat-square)

Tool to read/write Gherkin feature files and work with Gherking AST

## Usage

### Parse feature string

The `parse` function can be used to parse feature file content to [AST](https://github.com/gherking/gherkin-io).

```typescript
function parse(content: string, uri: string): Promise<Document>
```

In TypeScript:

```typescript
import {parse, Document} from "gherkin-io";
import {TagFormat} from "gherkin-ast";

const document: Document = await parse(
    "Feature: Test\n...",
    "./features/test.feature",
    {tagFormat: TagFormat.FUNCTIONAL} // default
);
```

In JavaScript:
```javascript
const {parse} = require("gherkin-io");
const {TagFormat} = require("gherkin-ast");
const document = await read(
    "Feature: Test\n...", 
    "./features/test.feature", 
    {tagFormat: TagFormat.FUNCTIONAL} // default
);
```

### Read feature files

The `read` function can be used to parse feature file(s) to [AST](https://github.com/gherking/gherkin-io).

```typescript
function read(pattern: string): Promise<Document[]>
```

In TypeScript:
```typescript
import {read, Document} from "gherkin-io";
import {TagFormat} from "gherkin-ast";

const documents: Document[] = await read(
    "./features/*.feature",
    {tagFormat: TagFormat.FUNCTIONAL} // default
);
```

In JavaScript:
```javascript
const {read} = require("gherkin-io");
const {TagFormat} = require("gherkin-ast");
const documents = await read(
    "./features/*.feature",
    {tagFormat: TagFormat.FUNCTIONAL} // default
);
```

### Write feature files

The `write` function can be used to write an AST to a feature file.

```typescript
function write(filePath: string, document: Document, options?: FormatterOptions): Promise<void>
```

In TypeScript:
```typescript
import {Document, write, FormatterOptions} from "gherkin-io";
const document: Document = new Document(/*...*/);
const options: FormatterOptions = {/*...*/};
await write("./test.feature", document, options);
```

In JavaScript:
```javascript
const {write, Document} = require("gherkin-io");
const document = new Document(/*...*/);
const options = {/*...*/};
await write("./test.feature", document, options);
```

`FormatterOptions` is re-exported from [gherkin-formatter](https://github.com/gherking/gherkin-formatter).

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gherkin-io/).
