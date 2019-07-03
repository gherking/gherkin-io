# gherkin-io

[![Build Status](https://travis-ci.org/gherking/gherkin-io.svg?branch=master)](https://travis-ci.org/gherking/gherkin-io) [![dependency Status](https://david-dm.org/gherking/gherkin-io.svg)](https://david-dm.org/gherking/gherkin-io) [![devDependency Status](https://david-dm.org/gherking/gherkin-io/dev-status.svg)](https://david-dm.org/gherking/gherkin-io#info=devDependencies)

Tool to read/write GHerkin feature files and work with Gherking AST

## Usage

### Read feature files

The `read` function can be used to parse feature file(s) to [AST](https://github.com/gherking/gherkin-ast).

```typescript
read(pattern: string): Promise<Document[]>
```

In TypeScript:
```typescript
import {read} from "gherkin-io";
import {Document} from "gherkin-ast";

const documents: Document[] = await read("./features/*.feature");
```

In JavaScript:
```javascript
const {read} = require("gherkin-io");
const documents = await read("./features/*.feature");
```

### Write feature files

The `write` function can be used to write an AST to a feature file.

```typescript
write(filePath: string, document: Document, options?: FormatterOptions): Promise<void>
```

In TypeScript:
```typescript
import {write, FormatterOptions} from "gherkin-io";
import {Document} from "gherkin-ast";
const document: Document = new Document(/*...*/);
const options: FormatterOptions = {/*...*/};
await write("./test.feature", document, options);
```

In JavaScript:
```javascript
const {write} = require("gherkin-io");
const {Document} = require("gherkin-ast")
const document = new Document(/*...*/);
const options = {/*...*/};
await write("./test.feature", document, options);
```

`FormatterOptions` is re-exported from [gherkin-formatter](https://github.com/gherking/gherkin-formatter).

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/ts-seed/).
