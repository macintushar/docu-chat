# DocuChat

DocuChat is an app that allows users to chat with their own documents.

It allows users to upload documents, which are then processed and then used as context for the LLM to chat with.

## Development

DocuChat has 2 parts: the server and the ui. If you are just developing for the server, then you can build the ui and run the server locally. The server will serve the built ui.

- Copy the `.env.example` file to `.env` and set the environment variables.

### server

- navigate to the repo base directory (contains the `README` and the `package.json` files)
- run `bun install` to install the dependencies
- run `bun run dev` to start the server
- go to http://localhost:3030 to see the server

### ui

- navigate to the `ui` directory
- run `bun install` to install the dependencies
- run `bun run dev` to start the development server
- go to http://localhost:5173 to see the ui

To install dependencies:

```sh
bun install
```

To run:

- Copy the `.env.example` file to `.env` and set the environment variables.

open http://localhost:3001
