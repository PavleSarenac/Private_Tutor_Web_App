import express from 'express';
import { DefaultController } from '../controllers/default.controller';

const defaultRouter = express.Router()

defaultRouter.route("/login").post(
    (request, response) => new DefaultController().login(request, response)
)

defaultRouter.route("/uploadProfilePicture").post(
    (request, response) => new DefaultController().uploadProfilePicture(request, response)
)

defaultRouter.route("/register").post(
    (request, response) => new DefaultController().register(request, response)
)

defaultRouter.route("/getNumberOfStudents").get(
    (request, response) => new DefaultController().getNumberOfStudents(request, response)
)

defaultRouter.route("/checkOldPassword").post(
    (request, response) => new DefaultController().checkOldPassword(request, response)
)

defaultRouter.route("/changePassword").post(
    (request, response) => new DefaultController().changePassword(request, response)
)

defaultRouter.route("/getUser").get(
    (request, response) => new DefaultController().getUser(request, response)
)

export default defaultRouter;