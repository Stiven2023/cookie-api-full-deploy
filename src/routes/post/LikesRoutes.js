import { Router, response } from "express";
import LikesController from "../../Controllers/Post/LikesController.js";

const routerLike = Router();

// routerLike.get("/", () => {
//   response.json([{ message: "Welcome to Likes" }]);
// });

routerLike.get("/:id/like", LikesController.read); //* read the likes
routerLike.post("/:id/like", LikesController.create); //* create a like
routerLike.delete("/:id/like", LikesController.delete); //* Delete a like

export default routerLike;
