import express from "express"
import { UserModel } from "../models/user.model"

export class StudentController {
    updateStudentInfo = (request: express.Request, response: express.Response) => {
        let student: any = request.body
        UserModel.updateOne(
            {
                username: student.username
            },
            {
                address: student.address,
                email: student.email,
                phone: student.phone,
                schoolType: student.schoolType,
                currentGrade: student.currentGrade
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }
}