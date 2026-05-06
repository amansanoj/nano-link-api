import { Hono } from "hono";

const docsRoute = new Hono();

docsRoute.get("/", (c) => {
  const file = Bun.file("./public/index.html");

  return new Response(file);
});

export default docsRoute;
