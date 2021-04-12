import PostNotFoundException from '../exceptions/PostNotFoundException';
import * as express from 'express';
import Post from './post.interface';
import postModel from './posts.model';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleware';

class PostsController {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = (request: express.Request, response: express.Response) => {
    this.post.find()
      .then((posts) => {
        response.send(posts);
      });
  }

  private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post.findById(id)
      .then((post) => {
        if (post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true })
      .then((post) => {
        if(post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  private createPost = (request: express.Request, response: express.Response) => {
    const postData: Post = request.body;
    const createPost = new this.post(postData);
    createPost.save()
      .then((savedPost) => {
        response.send(savedPost);
      });
  }

  private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id)
      .then((success) => {
        if (success) {
          response.send(200);
        } else {
          next(new PostNotFoundException(id));
        }
      })
  }
}

export default PostsController;