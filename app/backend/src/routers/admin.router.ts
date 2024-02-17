import express from 'express';
import { AdminController } from '../controllers/admin.controller';

const adminRouter = express.Router()

adminRouter.route("/downloadPdf").post(
    (request, response) => new AdminController().downloadPdf(request, response)
)

adminRouter.route("/approveTeacherRegistration").post(
    (request, response) => new AdminController().approveTeacherRegistration(request, response)
)

adminRouter.route("/banTeacherAccount").get(
    (request, response) => new AdminController().banTeacherAccount(request, response)
)

adminRouter.route("/updateSubjects").post(
    (request, response) => new AdminController().updateSubjects(request, response)
)

adminRouter.route("/getAverageClassesPerDay").get(
    (request, response) => new AdminController().getAverageClassesPerDay(request, response)
)

adminRouter.route("/getMostWantedTeachers").get(
    (request, response) => new AdminController().getMostWantedTeachers(request, response)
)

export default adminRouter