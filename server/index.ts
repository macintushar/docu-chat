import server from "./server";

try {
    Bun.serve({
        port: 8080,
        fetch: server.fetch
    })
} catch (error) {
    console.error(error)
}