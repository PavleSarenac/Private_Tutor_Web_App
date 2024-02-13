import express from 'express';
import { StudentController } from '../controllers/student.controller';

const studentRouter = express.Router()

studentRouter.route("/updateStudentInfo").post(
    (request, response) => new StudentController().updateStudentInfo(request, response)
)

studentRouter.route("/getAllStudents").get(
    (request, response) => new StudentController().getAllStudents(request, response)
)

export default studentRouter;