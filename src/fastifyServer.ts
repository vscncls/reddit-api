import fastify from "fastify";
import { LoggerSingleton } from "./LoggerSingleton";
import { PostsProvider } from "./PostsProvider";
import { UsersProvider } from "./UsersProvider";
import { PostOrdering } from "./PostOrdering";

const logger = new LoggerSingleton().getInstance();
const server = fastify({
  logger,
});

export type slashPostsParams = {
  startDate: string;
  endDate: string;
  sortBy: string;
};
const validSortTypes = ["UPS", "COMMENTS"];

server.get<{ Querystring: slashPostsParams }>("/posts", async (req, res) => {
  if ([req.query.startDate, req.query.endDate, req.query.endDate].some((val) => !val)) {
    res.status(400);
    res.send({ message: "All params are required" });
    return;
  }
  if (!validSortTypes.includes(req.query.sortBy)) {
    res.status(400);
    res.send({ message: `Invalid sort type, valid types are ${validSortTypes}` });
    return;
  }

  const filters = {
    startDate: new Date(req.query.startDate),
    endDate: new Date(req.query.endDate),
  };

  const postsProvider = new PostsProvider();
  const posts = await postsProvider.getPosts(filters, req.query.sortBy as PostOrdering);

  res.send(posts);
});

server.get<{ Querystring: { sortBy: string } }>("/users", async (req, res) => {
  if (!validSortTypes.includes(req.query.sortBy)) {
    res.status(400);
    res.send({ message: `Invalid sort type, valid types are ${validSortTypes}` });
    return;
  }

  const usersProvider = new UsersProvider();
  const users = await usersProvider.getUsers(req.query.sortBy as PostOrdering);

  res.send(users);
});

export { server as fastifyServer };
