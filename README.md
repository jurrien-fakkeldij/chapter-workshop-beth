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

## Introducing HTMX

### Adding HTMX
Now that we have setup our webserver to serve hypertext media content and we 
can use components within our application it is time to setup and add htmx.
We will add the following to our BaseHtml component between the <head></head> tag.
```html
<script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>
```

#### Extra 
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

#### Adding some css (but don't make it too hard because we are ING developers and not used to css)
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

## Let's create a todo app

### Add objects and components
Let's use all these tools we installed now to actually build an app.
First let's create the Todo type. We just add all of these to our index.tsx file
(we don't have to overcomplicate things).
``` typescript
type Todo {
  id: number;
  content: string
  completed: boolean
}
```
and create our inmemory database (just an array for now)
```typescript
const db : Todo[] = [
  { id: 1, content: "Learn to create and setup the BETH stack.", completed: true },
  { id: 2, content: "Create workshop", completed: true },
  { id: 3, content: "??", completed: false },
  { id: 4, content: "profit", completed: false }
]
```
Now create the TodoItem and TodoList component for rendering
```typescript
function TodoItem({ content, completed, id }: Todo) {
    return(
      <div class="flex flex-row space-x-3">
        <p>{content}</p>
        <input type="checkbox" checked={completed} />
        <button class="text-red-500">X</button>
      </div>
    );
}

function TodoList({todos} : {todos: Todo[]}) {
    return (
      <div>
      { todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      </div>
    );
}
```
Now we need to display this on the code, let's just get the body to load this 
using the features of htmx.
```html
<BaseHtml>
  <body   
    class="flex w-full h-screen justify-center items-center"
    hx-get="/todos"
    hx-trigger="load"
    hx-swap="innerHTML"
  />
</BaseHtml>
```
This does a few things, it uses hx-get to do a get call (check network tab),
it is triggered when the body component is loaded and swaps the entire 
innerHTML with the received response. To checkout other triggers please visit 
(https://htmx.org/attributes/hx-trigger/). You can view the result at 
http://localhost:3000/

### CRUD
Now we are going to create the CRUD (create, read, update, delete) functionality.

#### Update (why not start with update it is only 3rd in the acronym, create is really hard and we already have read sort of)
Let's start with update, to be able to toggle whether or not a todo is actually
done.
For this we need to add a post call to our router/
```typescript
.post(
  "/todos/toggle/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id);
      if (todo) {
        todo.completed = !todo.completed;
        return <TodoItem {...todo} />;
      }
    },
    {
      params: t.Object({
      id: t.Numeric(),
    }),
})
```
We introduced a few new things here. The additional argument/object in the post
function this defines the input validation for the route parameter (:id). The t
object is imported from elysia.
```typescript
import { Elysia, t } from "elysia";
```
This t.Numeric() function will automatically try to coerce any string to a number 
(unsure how safe this actually is).

Now we can update our TodoItem component to send a post when the input is 
toggled and we want to swap our entire component when we get the response not 
just the input itself. It will look as follows.
```html
<div id={id.toString()} class="flex flex-row space-x-3">
  <p>${content}</p>
  <input
   type="checkbox"
    checked={completed}
    hx-post={`/todos/toggle/${id}`}
    hx-target="closest div"
    hx-swap="outerHTML"
  />
  <button class="text-red-500">X</button>
</div>
```
Notice the hx-target and hx-swap parameters. hx-target can target any dom 
element using css selectors and other search methods. For more info on hx-target 
please visit https://htmx.org/attributes/hx-target/. hx-swap is set to outerHTML 
to replace the entire target element with the response. For more information on 
hx-swap visit https://htmx.org/attributes/hx-swap/

Now when we reload the page the state will remain the same and not change after 
a reload. Check this at http://localhost:3000/

#### Delete (because well it is the next in the acronym right?)
To be able to delete we are going to have to add a delete function to the router 
(lucky for us this framework is built for humans and not computers, if you don't 
understand this I am assuming you did not open the elysia webpage).
```typescript
.delete(
  "/todos/:id",
  ({ params }) => {
      const todo = db.find((todo => todo.id === params.id));
      if (todo) {
        db.splice(db.indexOf(todo), 1);
      }
  },
  {
    params: t.Object({
      id: t.Numeric(),
    }),
  }
)
```
And now we have to update our component to actually call this delete endpoint.
It will now resemble something like below
```html
<div id={id.toString()} class="flex flex-row space-x-3">
  <p>${content}</p>
  <input
   type="checkbox"
    checked={completed}
    hx-post={`/todos/toggle/${id}`}
    hx-target="closest div"
    hx-swap="outerHTML"
  />
  <button 
    class="text-red-500"
    hx-delete={`/todos/${id}`}
    hx-swap="outerHTML"
    hx-target="closest div">X</button>
</div>
```
This is something different, meaning the delete endpoint actually doesn't return
an element or anything actually and hx-swap actually has a delete value it does
not make sense in this case. We only want to change the element if the call is 
successful and the delete value deletes it no matter what. An by returning an
empty response the component actually gets overwritten with nothing and therefor
we have what we want. Look at http://localhost:3000 and try to delete something 
in order to get it back we have to reload the whole application

#### Create 
Creating new todo's, why would we want this. Then our todolist can only grow right?
Anyway from CRUD perspective it is there and we need to implement it otherwise it is only RUD.

We will start with creating a post endpoint /todos
```typescript
.post(
  "/todos",
  ({ body }) => {
    if (body.content.length === 0) {
        throw new Error("Content cannot be empty");
    }
    const newTodo = {
        id: lastID++,
        content: body.content,
        completed: false,
    };
    db.push(newTodo);
    return <TodoItem {...newTodo} />;
  },
  {
    body: t.Object({
      conent: t.String(),
    }),
  }
),
```

Notice the lastID variable let's create that just above our database (array) and
use the id that you have set last.
```typescript
let lastID = 4;
```

Now on to creating the form component so we can actually add the todo.
```typescript
function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}
```

and add this form to our TodoList component.
```html
<div>
  {todos.map((todo) => (
    <TodoItem {...todo} />
  ))}
  <TodoForm />
</div>
```
And now we should have full CRUD functionality. Let's test at http://localhost:3000

## Database
Well since the state of our application is now changing everytime we reset our 
application (nothing will happen if we just leave the laptop open right with our
billion user app running on it) we want to add a database. Bun to the rescue again.
Bun has built-in sqllite functionality. Let's use it.

### Create database tables and setup script.
We want to move some files around to make sure we can comfortably add more files
without everything on the route folder.
create a src folder
```bash
mkdir src
```
move our index.tsx into this folder. (don't forget to change your startup command)
```bash
mv index.tsx ./src/index.tsx
```
Then we create a db folder inside the source folder
```bash
cd src
mkdir db
```

In the db folder we will create the schema.ts file.
```typescript
import { InferModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});

export type Todo = InferModel<typeof todos>;
```
To make sure drizzle knows where everything is we have to create a drizzle
config file (drizzle.config.ts) on the root.

```
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  verbose: true,
  strict: true,
} satisfies Config;
```

To connect to our database we are creating an index.ts file to do so.
```typescript
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from "./schema";
 
const sqlite = new Database('sqlite.db');
export const db: BunSQLiteDatabase = drizzle(sqlite, {schema, logger:true});
```

