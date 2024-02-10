import express from 'express';
import { TeacherController } from '../controllers/teacher.controller';

const teacherRouter = express.Router()

teacherRouter.route("/uploadCv").post(
    (request, response) => new TeacherController().uploadCv(request, response)
)

export default teacherRouter;