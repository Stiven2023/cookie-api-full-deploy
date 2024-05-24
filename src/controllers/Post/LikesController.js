import PostModel from "../../models/Post";
import { likeSchemaZod } from "../../ZodSchemes/PostSchema.js";

// Todo: Like Actions
class LikeController {
  static async read(request, response) {
    const { id } = request.params;
    const post = await PostModel.findById(id);
    response.json(post.likes);
  }
  static async create(request, response) {
    const { id } = request.params;
    const like = request.body;

    //! Validate Data
    const validationResult = likeSchemaZod.safeParse(like);

    if (validationResult.success) {
      try {
        const post = await PostModel.findById(id);
        post.likes.push(like);
        await post.save();
        response.json({ Message: "Resource created successfully" });
      } catch (error) {
        response
          .status(500)
          .json({ Error: "Failed to create resource", Details: error });
      }
    } else {
      return response
        .status(400)
        .json({ Error: "Invalid data", Details: validationResult.error });
    }

    //* Create Resource "Like" for this update in the collection Post in field Likes
  }
  static async delete(request, response) {
    const { id } = request.params;
    //! Delete resource
    PostModel.findByIdAndDelete(id)
      .then(() => {
        response.json({ Message: "Resource deleted successfully" });
      })
      .catch((error) => {
        response
          .status(500)
          .json({ Error: "Failed to delete resource", Details: error });
      });
  }
}

export default LikeController;
