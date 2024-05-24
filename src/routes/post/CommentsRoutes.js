import { Router, response } from "express";
import commentsController from "../../controllers/Post/CommentController.js";

const routerComment = Router();

// * Comments
routerComment.get("/", () => {
  response.json({ message: "Welcome to comments" });
});

routerComment.get("/:id/comment", commentsController.read); //* read the comments
routerComment.post("/:id/comment", commentsController.create); //* create a comment
routerComment.delete("/:id/comment", commentsController.delete); //* Delete a post

export default routerComment;
