import express from "express"
import * as fileSystem from "fs"
import { UserModel } from "../models/user.model"
import DataModel from "../models/data.model"

export class AdminController {
    downloadPdf = (request: express.Request, response: express.Response) => {
        const teacher = request.body
        response.setHeader("Content-Type", "application/pdf")
        response.setHeader("Content-Disposition", `attachment; filename=${teacher.username}_CV.pdf`)
        const fileStream = fileSystem.createReadStream(teacher.cvPath)
        fileStream.pipe(response)
    }

    approveTeacherRegistration = (request: express.Request, response: express.Response) => {
        let teacher = request.body
        UserModel.updateOne(
            { username: teacher.username },
            {
                isAccountActive: true,
                isAccountPending: false,
                isAccountBanned: false
            }
        ).then(
            () => {
                DataModel.find({}).then(
                    (data: any[]) => {
                        teacher.teacherSubjects.forEach(
                            (subject: any) => {
                                if (!data[0].subjects.includes(subject)) {
                                    data[0].subjects.push(subject)
                                }
                            }
                        )
                        DataModel.deleteMany({}).then(
                            () => {
                                DataModel.insertMany(data).then(
                                    () => response.json({ content: "ok" })
                                ).catch((error) => console.log(error))
                            }
                        ).catch((error) => console.log(error))
                    }
                ).catch((error) => console.log(error))
            }
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

    updateSubjects = (request: express.Request, response: express.Response) => {
        let newSubjectsArray = request.body
        DataModel.updateOne(
            {},
            {
                subjects: newSubjectsArray
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }
}