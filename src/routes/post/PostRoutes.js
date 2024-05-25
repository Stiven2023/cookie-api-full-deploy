import { Router, response } from "express";
import PostController from "../../Controllers/Post/PostController";

const routerPost = Router();

//* Post
routerPost.get("/", PostController.read); //* Recover all post
routerPost.post("/", PostController.create); //* Create new post
routerPost.get("/:id", PostController.readUnique); //* Recover unique post
routerPost.delete("/:id", PostController.delete); //* Delete a post

export default routerPost;
