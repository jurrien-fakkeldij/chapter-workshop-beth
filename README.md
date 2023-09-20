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
So what is the BETH Stack and why do we want to use it? 

Well this stack uses the tools and technologies explained below as well as some others that we will go through in the workshop itself (but are not as important to put in the acronym).

For why do we want to use it, well it is fun to try something on somewhat bleeding edge and it shows a way to handle requests and responses using HTMX instead of html and rest.
Now I hear some of you think: "didn't we do this with jsp / php pages already?". Well yes, but for that still the only way to get data was reload the entire page. With HTMX we are going to explore to do this on component level.
Some others will say: "Will we ever use this in our daily jobs?". Probably not, doesn't make it unfun to try this out right?

### BUN
Bun is an all-in-one toolkit for JavaScript and TypeScript apps. It ships as a single executable called bun​.

At its core is the Bun runtime, a fast JavaScript runtime designed as a drop-in replacement for Node.js. It's written in Zig and powered by JavaScriptCore under the hood, dramatically reducing startup times and memory usage.

Sounds like a bold statement and for those who have not followed the discussions online for this, the verdict is not yet complete. Nevertheless we are going to play around with it. You can find more information on their website https://bun.sh/.

### Elysia
Ergonomic Framework for Humans

TypeScript framework supercharged by Bun with End-to-End Type Safety, unified type system and outstanding developer experience

Sounds like express, but then for humans? Anyway it is quite new and as it states it is supercharged by Bun we want to use it right. You can find also more information on this at https://elysiajs.com/

### Turso / sqllite
SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inside countless other applications that people use every day.
The SQLite file format is stable, cross-platform, and backwards compatible and the developers pledge to keep it that way through the year 2050. SQLite database files are commonly used as containers to transfer rich content between systems and as a long-term archival format for data. There are over 1 trillion (1e12) SQLite databases in active use.

This is not new, but very useful for proof-of-concepts and comes out of the box with Bun. For more information on how bun uses it https://bun.sh/docs/api/sqlite or the documentation itself https://www.sqlite.org/index.html.

Turso is an edge-hosted, distributed database based on libSQL, an open-source and open-contribution fork of SQLite. It was designed to minimize query latency for applications where queries come from anywhere in the world. In particular, it works well with edge functions provided by cloud platforms such as CloudFlare, Netlify, and Vercel, by putting your data geographically close to the code that accesses it.

This sounds interesting, let's just use it. Due to the length of this course this is the last part and only if we have time for this.
For more information please check out https://turso.tech/.

### HTMX
htmx gives you access to AJAX, CSS Transitions, WebSockets and Server Sent Events directly in HTML, using attributes, so you can build modern user interfaces with the simplicity and power of hypertext. 

Sounds cool but why would we want this if we have javascript and rest? 

Well their motivation is:
- Why should only `<a>` and `<form>` be able to make HTTP requests?
- Why should only `click` & `submit` events trigger them?
- Why should only `GET` & `POST` methods be available?
- Why should you only be able to replace the entire screen?

By removing these arbitrary constraints, htmx completes HTML as a hypertext. You can find more information about this on https://htmx.org/.

Now let's see how we set all these up and actually build an application with this. Sorry this is going to be another Todo app all over again, but with blazingly fast startup times and less memory usage.

## Setup BUN

To make sure we can run our application in bun we need to setup a server in bun and make sure this architecture runs on our machines. This part will cover installing and setting up our server using only bun.

### Installing BUN 
```bash 
curl -fsSL https://bun.sh/install | bash 
```

### Setup server
First we need to tell bun to init in the folder we want to create our application in by executing the following command in the root and go through all the questions
```bash
mkdir chapter-workshop-beth && cd chapter-workshop-beth
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

This sets up everything for us to start our bun server. We can run the server now with the `run` command.
```bash
bun run index.ts
```
Running this should show a log line on the command line with `Hello via Bun!` (or something like this, it should not show any errors).

#### Watch/Hot
We can also watch our files so we don't have restart our server if we change our ts / tsx (later) files with the `--watch` or `--hot` argument.
```bash
bun run --watch index.ts
bun run --hot index.ts
```

Having setup bun we can continue with the next step for our application.
For this we are going to add Elysia in the mix.

## Use Elysia
We are going to use Elysia to serve our html(x) content and setup our other routes for `GET`, `POST` or any other method. First we have to add this to our application and then we can setup our routes for our application.

### Add Elysia
We can simply add Elysia using bun with the command below.
```bash
bun add elysia
```
See how fast bun actually installs this, is this not amazing (compared to NODE that is)?

To add it to our application we need to open index.ts and change the entire content to the following:
```typescript
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello world from Elysia").listen(3000);
console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
```

After we saved our file, we can now run our new application using the `run` command again or if you have used the `watch` or `hot` argument it should automatically have reloaded.
```bash
bun run index.ts
```
It should now display the following log line on the command line.
```bash
Elysia is running at http://localhost:3000
```
We have successfully added Elysia to our application. We can double check this by going to http://localhost:3000 (or any port that you put in) and it should show you Hello World from Elysia.

Sadly we are not able to server html yet at this moment with Elysia, if you try to add html as output it will just show up as text on the browser (try this if you don't believe me). For this we need to add another plugin/library (welcome to front-end land, where we can just add another plugin or library for everything).

### Add html to Elysia
To add the html plugin for Elysia so we can actually display html (this is important for the last part htmx) we need to add the html plugin.
```bash
bun add @elysia/html
```
To make sure this works we are going to add a constant base html variable to our index.ts file and use this.

Make sure we can use the html functionality within our application, to do this we add the following import statement to the top of our file.
```typescript
import { html } from "@elysiajs/html";
```

Add the constant base html variable at the end of the file (or anywhere you like, something about hoisting right?).
```typescript
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

Now we can update the router on the app to display this baseHtml variable by changing the router code to the following. 
```typescript
const app = new Elysia()
  .use(html())
  .get("/", ({html}) => html(baseHtml))
  .listen(3000);
```
From now on I am going to assume you have used the `watch` or `hot` parameters if not you have to rerun the `run` command everytime we look at the webpage otherwise your changes will not be reflected.
So when we look at http://localhost:3000 it should show our html page as a html page and not just all the tags as text.

Now we want to use templating right? Makes our lives a lot easier for this we again need to drop in another dependency (plugin/library).

### Bring in typed-html
We are adding typed-html to this so we can create templates, so it is easier to maintain if we can create our own components and not have to write the same html code every time.
To do so we want to add typed-html as a devDependency with the command below.
```bash
bun add -d typed-html
```
Again just marvel in the speed bun offers us here.

Then we want to adjust our tsconfig.json file to use the following two lines (if they exists replace them otherwise add them in the compilerOptions object).
```json
{
...
    "jsx": "react",
    "jsxFactory": "elements.createElement",
...
}
```
Although we're configuring the compiler to use React, this is not what is being used. Instead, we redirect all jsx element to typed-html's elements.createElement.

We do have to rename our index.ts to index.tsx.
```bash
mv index.ts index.tsx
```

We also have to make sure we use this new file in our run command.
```bash
bun run --watch index.tsx
```

In our index.tsx file we now have to add our just added dev dependency using an import statement.
```typescript
import * as elements from "typed-html";
```

Now we are going to change our baseHtml variable to be a component and use templating. Change the current `const baseHtml` variable in your code to the following.
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
We now made it a function accepting a list of children (html objects) to display after the head tag and returning this.

To use this new `BaseHtml` component we have to update our `GET /` route to the following.
```javascript
.get("/", ({ html }) => html(
  <BaseHtml>
    <body>
      <h1>Hello World from Elysia Dom!</h1> I am a html document with a component.
    </body>
  </BaseHtml>
))
```
We changed the html to use the `<BaseHtml>` tag and added plain html (as a child, whoo xml sytnax).

When looking at http://localhost:3000 (assuming you restarted the server with the new .tsx file) this should reflect the changes we made.

We now are ready to use Bun to create our application and run our Elysia server to serve our html components and templates. Now it is time to add htmx into this brewing pot we call an application.

THIS IS WHERE I LEFT WHEN EDDITING THIS PAGE!!!

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
      content: t.String(),
    }),
  }
),
```

Notice the lastID variable let's create that just above our database (array) and
use the id+1 that you have set last.
```typescript
let lastID = 5;
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

First add some dependencies

```bash
bun add drizzle-orm
bun add -d drizzle-kit
```

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

To connect to our database we are creating an index.ts file to do so also in the db folder
```typescript
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from "./schema";

const sqlite = new Database('todo.db', { create: true });
sqlite.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, content TEXT NOT NULL, completed INTEGER NOT NULL);"
);

export const db: BunSQLiteDatabase = drizzle(sqlite, { schema, logger: true });
```

### Update src/index.tsx to use our database
Now we need to remove our current database (array) and use this database we are creating.

First add our imports that we just created.

```typescript
import { todos, Todo } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
```

Then for getting the data from our db in our routes
```typescript
.get("/todos", async () => {
    const data = await db.select().from(todos);
    return <TodoList todos={data} />;
})
.post(
    "/todos/toggle/:id",
    async ({ params }) => {
        const oldTodo = await db
            .select()
            .from(todos)
            .where(eq(todos.id, params.id))

        const newTodo = await db
            .update(todos)
            .set({ completed: !oldTodo?.pop()?.completed })
            .where(eq(todos.id, params.id))
            .returning()

        return <TodoItem {...newTodo.pop()} />;
    },
    {
        params: t.Object({
            id: t.Numeric(),
        }),
    })
.delete(
    "/todos/:id",
    async ({ params }) => {
        await db.delete(todos).where(eq(todos.id, params.id));
    },
    {
        params: t.Object({
            id: t.Numeric(),
        }),
    }
)
.post(
    "/todos",
    async ({ body }) => {
        if (body.content.length === 0) {
            throw new Error("Content cannot be empty");
        }
        const newTodo = await db.insert(todos).values({ content: body.content }).returning();
        return <TodoItem {...newTodo.pop()} />;
    },
    {
        body: t.Object({
            content: t.String(),
        }),
    }
)
```

And don't forget to remove our current database (array) and the inserts for that database.
We should now have an app for a todo list that persists through server resets (don't overwrite the database).
Test this at http://localhost:3000/

## Extra content unlocked

### Turso
So at the beginning we talked about what the BETH stack was and we missed the T, well not really I think using the builtin sqlite from Bun served us well here.
However I think we should still use it and I will go over the edits needed to connect to Turso.
I already created a database with an existing table, so this means that we will all have a similar view on the state once we all connect.
This will bring it's own misery (don't delete something that doesn't exist).

Start with adding new dependencies since we won't be using the bun sqlite drivers but now libsql drivers.
```bash
bun add @libsql/client
```

I am not going to go into creating this database, you can watch the YT video for that if you like.
We do need to create some environment variables we can later also use to store as secrets in a pipeline (also in the video not in this course).
Let's create a .env file in the root of the project.
```bash
DATABASE_URL=GET_THIS_FROM_ME_TO_CONNECT_TO_DB
DATABASE_AUTH_TOKEN=GET_THIS_FROM_ME_FOR_MAGIC
```

and create a drizzle.config.ts file to tell drizzle where to connect to
```typescript
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    driver: "turso",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    verbose: true,
    strict: true
} satisfies Config;
```
We don't have to change the schema, we do have to change our index.ts in the db folder.
We are connecting using a different driver and library.
```typescript
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client'
import * as schema from "./schema";


const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db: LibSQLDatabase<typeof schema> = drizzle(client, { schema, logger: true });
```
And voila you should now be connecting to the Database I setup earlier and see the items in this todo database on http://localhost:3000

