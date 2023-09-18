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

