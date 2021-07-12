import fastify from "fastify";
import { LoggerSingleton } from "./LoggerSingleton";
import { PostsProvider } from "./PostsProvider";
import { UsersProvider } from "./UsersProvider";
import { PostOrdering } from "./PostOrdering";

const logger = new LoggerSingleton().getInstance();
const server = fastify({
  logger,
});

server.addSchema({
  $id: "sortByPostType",
  type: "string",
  pattern: "^(UPS|COMMENTS)$",
});

server.addSchema({
  $id: "postsParams",
  type: "object",
  properties: {
    startDate: { type: "string", format: "date" },
    endDate: { type: "string", format: "date" },
    sortBy: { $ref: "sortByPostType#" },
  },
  required: ["startDate", "endDate", "sortBy"],
});

server.addSchema({
  $id: "getUsersParams",
  type: "object",
  properties: {
    sortBy: { $ref: "sortByPostType#" },
  },
  required: ["sortBy"],
});

export type slashPostsParams = {
  startDate: string;
  endDate: string;
  sortBy: PostOrdering;
};

server.get<{ Querystring: slashPostsParams }>(
  "/posts",
  { schema: { querystring: { $ref: "postsParams#" } } },
  async (req, res) => {
    const filters = {
      startDate: new Date(req.query.startDate),
      endDate: new Date(req.query.endDate),
    };

    const postsProvider = new PostsProvider();
    const posts = await postsProvider.getPosts(filters, req.query.sortBy as PostOrdering);

    res.send(posts);
  }
);

server.get<{ Querystring: { sortBy: PostOrdering } }>(
  "/users",
  { schema: { querystring: { $ref: "getUsersParams#" } } },
  async (req, res) => {
    const usersProvider = new UsersProvider();
    const users = await usersProvider.getUsers(req.query.sortBy);

    res.send(users);
  }
);

export { server as fastifyServer };
