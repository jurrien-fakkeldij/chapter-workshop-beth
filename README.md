# BETH Stack workshop

## BETH Stack
### BUN
- https://bun.sh/

### Elysia
- https://elysiajs.com/

### Turso / sqllite
- https://turso.tech/
- https://bun.sh/docs/api/sqlite

### HTMX
- https://htmx.org/

## Setup BUN

### Installing BUN 
```bash 
curl -fsSL https://bun.sh/install | bash 
```

### Setup server
First we need to initialize bun by executing the following command and go through all the questions
```bash
bun init
```
```bash
bun init helps you get started with a minimal project and tries to guess sensible defaults. Press ^C anytime to quit
package name (chapter-workshop-beth):
entry point (index.ts):

Done! A package.json file was saved in the current directory.
+ index.ts
+ .gitignore
+ tsconfig.json (for editor auto-complete)
```

This sets up everything for us to start. We can run the server now with
```bash
bun run index.ts
```
and should show a command line log line with Hello via Bun!

## Use Elysia

### Add Elysia
We can simply add Elysia using Bun
```bash
bun add elysia
```
To add it to our application we need to open index.ts and change it to the following.
```javascript
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello world from Elysia").listen(3000);
console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
```

and then run it

```bash
bun run index.ts
```
Should result in
```bash
Elysia is running at http://localhost:3000
```
and showing you the webpage at http://localhost:3000 with Hello World from Elysia.

Great now we have added Elysia as our backend for displaying pages and be our rest server.
We are not able to use html itself yet within our application (try if you like), but will result in the page displaying the text with just the tags.

#### Extra
From now on we can also watch our files so we don't have restart if we change our ts / tsx (later) files.
```bash
bun run --watch index.ts
```


### Add html to Elysia
To add the html plugin for Elysia so we can actually display html (this is important for the last part htmx) we need to add the html plugin.
```bash
bun add @elysia/html
```

To make sure this works we are going to add a constant base html to our index.ts file and use this.
Add the import

```javascript
import { html } from "@elysiajs/html";
```
add the constant base html
```javascript
const baseHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Chapter Workshop</title>
</head>
<body><h1>Hello World from Elysia Dom!</h1> I am a html document </body>
</html > `;
```
and update the app and router to the following
```javascript
const app = new Elysia()
  .use(html())
  .get("/", ({html}) => html(baseHtml))
  .listen(3000);
```
