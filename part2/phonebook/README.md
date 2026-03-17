# Phonebook (Full Stack Open – Part 2)

This is the solution for the **Phonebook** exercises (2.6–2.15).

## Install & run

```bash
npm install
npm run dev
```

## JSON Server (exercise 2.11)

In a separate terminal, start `json-server` on port `3001`:

```bash
npx json-server --port 3001 --watch db.json
```

Then verify the data is available at `http://localhost:3001/persons`.

Exercises 2.12–2.15 add create/update/delete operations, so `json-server` needs to be running while you use the app.

## Other commands

```bash
npm run lint
npm run build
npm run preview
```
