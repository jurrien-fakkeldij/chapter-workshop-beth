# BETH Stack workshop

## Disclaimer
I got inspiration (read: blatently copied the content in his video, with a bit 
of my own flavour) from youtuber Ethan Niser at 
https://www.youtube.com/watch?v=cpzowDDJj24
Just wanted to create a follow everything in a md for my team at work to easily 
copy and paste the code without having to type everything.
Watch the video, it is all explained there as well I don't want to take credit 
for this whatsoever.

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
and update the app and router to the following to use the html plugin and the baseHtml
```javascript
const app = new Elysia()
  .use(html())
  .get("/", ({html}) => html(baseHtml))
  .listen(3000);
```

### Bring in JSX
We are adding JSX to this so we can create typed html or components.
To do so we want to add typed-html as a devDependency.
```bash
bun add -d typed-html
```
Then we want to adjust our tsconfig.json file to use the following.
```json
{
...
    "jsx": "react",
    "jsxFactory": "elements.createElement",
...
}
```
Rename our index.ts to index.tsx.
```bash
mv index.ts index.tsx
```

Open index.tsx and import elements.
```javascript
import * as elements from "typed-html";
```

Then we need to make our base html variable a component with children using 
typed-html and and the children subset after the head tag.
```javascript
const BaseHtml = ({children}: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Chapter Workshop</title>
</head>
${children}
</html > `;
```
and update our route to use this new component.
```javascript
.get("/", ({ html }) => html(
  <BaseHtml>
  <body>
    <h1>Hello World from Elysia Dom!</h1> I am a html document with a component.
  </body>
  </BaseHtml>
))
```

This should now be reflected in your webpage at http://localhost:3000/

## Adding HTMX
Now that we have setup our webserver to serve hypertext media content and we 
can use components within our application it is time to setup and add htmx.
We will add the following to our BaseHtml component between the <head></head> tag.
```html
<script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>
```

### Extra 
There is a vs-code extension called htmx-tags, no idea if it actually works 
because I have not tried it yet.

### HTMX Test
In the body of our BaseHTML component we are going to create a button with a 
hx-post function going to /clicked using hx-swap set to outerhtml to replace 
the target (button) element with the returning response (swap the entire thing).
```html
<BaseHtml>
  <body>
    <button hx-post="/clicked" hx-swap="outerHTML">
      Click Me
    </button>
  </body>
</BaseHtml>
```
Also adding our route for /clicked and giving it a proper response.
```javascript
.post("/clicked", () => (
  <div>Now I am a div and not a button anymore returned from the server</div>
))
```
It should now work on http://localhost:3000/ displaying a button first and when
clicking on it it changes to the div we created in our post.

### Adding some css (but don't make it too hard because we are ING developers and not used to css)
For this we are going to use tailwindcss (https://tailwindcss.com/) and they
also have a nice import which we can add between our <head></head> tags. Note:
Don't use in a production environment.
```html
<script src="https://cdn.tailwindcss.com"></script>
```
and add some css to our components and/or page (play around with this as much 
as you like).
```html
<body class="flex w-full h-screen justify-center items-center">
  <button class="border rounded" hx-post="/clicked" hx-swap="outerHTML">
    Click Me
  </button>
</body>

<div class="text-blue-600">
  Now I am a div and not a button anymore returned from the server
</div>
```
