
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import App from './app';
import PostsController from './posts/posts.controller';
import AuthenticationController from './authentication/authentication.controller';

validateEnv();

const app = new App(
  [
    new PostsController(),
    new AuthenticationController()
  ]
)

app.listen();