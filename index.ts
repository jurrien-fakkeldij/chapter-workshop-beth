import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello world from Elysia").listen(3000);
console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
