import express from 'express';
import { DefaultController } from '../controllers/default.controller';

const defaultRouter = express.Router()

defaultRouter.route("/login").post(
    (request, response) => new DefaultController().login(request, response)
)

export default defaultRouter;