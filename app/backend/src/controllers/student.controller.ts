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
                name: student.name,
                surname: student.surname,
                address: student.address,
                email: student.email,
                phone: student.phone,
                schoolType: student.schoolType,
                currentGrade: student.currentGrade,
                profilePicturePath: student.profilePicturePath
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }

    getAllStudents = (request: express.Request, response: express.Response) => {
        UserModel.find({ userType: "student" })
            .then((students) => response.json(students))
            .catch((error) => console.log(error))
    }
}