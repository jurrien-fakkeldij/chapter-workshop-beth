import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

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
        return <TodoList todos={db} />;
    })
    .post("/clicked", () => (
        <div class="text-blue-600">
            Now I am a div and not a button anymore returned from the server
        </div>
    ))
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

type Todo = {
    id: number,
    content: string,
    completed: boolean,
}

const db: Todo[] = [
    { id: 1, content: "Learn to create and setup the BETH stack.", completed: true },
    { id: 2, content: "Create workshop", completed: true },
    { id: 3, content: "??", completed: false },
    { id: 4, content: "profit", completed: false }
]

function TodoItem({ content, completed, id }: Todo) {
    return (
        <div class="flex flex-row space-x-3">
            <p>{content}</p>
            <input type="checkbox" checked={completed} />
            <button class="text-red-500">X</button>
        </div>
    );
}

function TodoList({ todos }: { todos: Todo[] }) {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem {...todo} />
            ))}
        </div>
    );
}