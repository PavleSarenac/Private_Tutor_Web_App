import express from 'express';
import { TeacherController } from '../controllers/teacher.controller';

const teacherRouter = express.Router()

teacherRouter.route("/uploadCv").post(
    (request, response) => new TeacherController().uploadCv(request, response)
)

teacherRouter.route("/getAllActiveTeachers").get(
    (request, response) => new TeacherController().getAllActiveTeachers(request, response)
)

teacherRouter.route("/getAllPendingTeachers").get(
    (request, response) => new TeacherController().getAllPendingTeachers(request, response)
)

teacherRouter.route("/updateTeacherInfo").post(
    (request, response) => new TeacherController().updateTeacherInfo(request, response)
)

export default teacherRouter