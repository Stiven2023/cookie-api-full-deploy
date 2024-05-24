import PostModel from "../../models/Post";

// Todo: Comments Actions
class commentController {
  static async read(request, response) {
    const { id } = request.params;
    const post = await PostModel.findById(id);
    response.json(post.comments);
  }
  static async create(request, response) {
    const { id } = request.params;
    const comment = request.body;

    //* Create Resource "Like" for this update in the collection Post in field Likes

    try {
      const post = await PostModel.findById(id);
      post.comments.push(comment);
      await post.save();
      response.json({ Message: "Resource created successfully" });
    } catch (error) {
      response
        .status(500)
        .json({ Error: "Failed to create resource", Details: error });
    }
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

export default commentController;
