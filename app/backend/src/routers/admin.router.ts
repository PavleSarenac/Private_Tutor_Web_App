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

export default adminRouter