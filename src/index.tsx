import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { todos, Todo } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

const app = new Elysia()
    .use(html())
    .get("/", ({ html }) => html(
        <BaseHtml>
            <body
                class="flex w-full h-screen justify-center items-center"
                hx-get="/todos"
                hx-trigger="load"
                hx-swap="innerHTML"
            />
        </BaseHtml>
    ))
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
    .listen(3000);
console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>
<script src="https://cdn.tailwindcss.com"></script>
<title>Chapter Workshop</title>
</head>
${children}
</html> `;

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

function TodoItem({ content, completed, id }: Todo) {
    return (
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
    );
}

function TodoList({ todos }: { todos: Todo[] }) {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem {...todo} />
            ))}
            <TodoForm />
        </div>
    );
}
