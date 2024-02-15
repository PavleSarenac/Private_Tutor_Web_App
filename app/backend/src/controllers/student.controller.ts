import express from "express"
import { UserModel } from "../models/user.model"
import ClassModel from "../models/class.model"

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

    scheduleClass = (request: express.Request, response: express.Response) => {
        let newClass = request.body
        let newId = 1
        ClassModel.find({}).sort({ id: "descending" }).limit(1).then(
            (classes: any[]) => {
                if (classes.length > 0) {
                    newId = classes[0].id + 1
                }
                newClass.id = newId
                new ClassModel(newClass).save().then(
                    () => response.json({ content: "ok" })
                ).catch((error) => console.log(error))
            }
        ).catch((error) => console.log(error))
    }
}