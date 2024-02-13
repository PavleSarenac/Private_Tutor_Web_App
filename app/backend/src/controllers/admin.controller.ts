import express from "express"
import * as fileSystem from "fs"
import { UserModel } from "../models/user.model"

export class AdminController {
    downloadPdf = (request: express.Request, response: express.Response) => {
        const teacher = request.body
        response.setHeader("Content-Type", "application/pdf")
        response.setHeader("Content-Disposition", `attachment; filename=${teacher.username}_CV.pdf`)
        const fileStream = fileSystem.createReadStream(teacher.cvPath)
        fileStream.pipe(response)
    }

    approveTeacherRegistration = (request: express.Request, response: express.Response) => {
        let teacherUsername = request.query.teacherUsername
        UserModel.updateOne(
            { username: teacherUsername },
            {
                isAccountActive: true,
                isAccountPending: false,
                isAccountBanned: false
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }

    banTeacherAccount = (request: express.Request, response: express.Response) => {
        let teacherUsername = request.query.teacherUsername
        UserModel.updateOne(
            { username: teacherUsername },
            {
                isAccountActive: false,
                isAccountPending: false,
                isAccountBanned: true
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }
}