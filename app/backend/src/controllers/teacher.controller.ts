import express from "express"
import { DefaultController } from "./default.controller"
import multer from "multer"
import * as fileSystem from "fs"
import { UserModel } from "../models/user.model"
import DataModel from "../models/data.model"

const NUMBER_OF_BYTES_IN_ONE_KILOBYTE = 1024
const NUMBER_OF_KILOBYTES_IN_ONE_MEGABYTE = 1024

export class TeacherController {
    uploadCv = (request: express.Request, response: express.Response) => {
        let currentDateTimeString: string = DefaultController.currentRegisterAttemptDateTimeString
        let extension: string = ""
        let filename: string = ""
        let filepath: string = ""
        const cvStorage = multer.diskStorage({
            destination: (request, file, callback) => {
                callback(null, "./files/cvs")
            },
            filename: (request, file, callback) => {
                extension = file.originalname.substring(file.originalname.indexOf("."))
                filename = currentDateTimeString + extension
                filepath = "./files/cvs/" + filename
                callback(null, filename)
            }
        });
        const uploadMulter = multer({ storage: cvStorage })
        uploadMulter.single("cv")(request, response, (error) => {
            if (error) {
                console.log(error)
                response.status(500).json({ content: "CV upload failed." })
            } else {
                const cvSizeInBytes = fileSystem.statSync(filepath).size
                const cvSizeInMegaBytes = cvSizeInBytes / (NUMBER_OF_BYTES_IN_ONE_KILOBYTE * NUMBER_OF_KILOBYTES_IN_ONE_MEGABYTE)
                const maxCvSizeInMegaBytes = 3
                if (cvSizeInMegaBytes > maxCvSizeInMegaBytes) {
                    fileSystem.unlinkSync(filepath)
                    fileSystem.unlinkSync(`${DefaultController.currentProfilePictureFilePath}`)
                    response.json({
                        content: `ERROR|CV is larger than 3 MB - it is ${cvSizeInMegaBytes} MB.`
                    })
                } else {
                    response.json({ content: `FILEPATH|${filepath}` })
                }
            }
        })
    }

    getAllActiveTeachers = (request: express.Request, response: express.Response) => {
        UserModel.find({ userType: "teacher", isAccountActive: true, isAccountPending: false, isAccountBanned: false })
            .then((teachers) => response.json(teachers))
            .catch((error) => console.log(error))
    }

    getAllPendingTeachers = (request: express.Request, response: express.Response) => {
        UserModel.find({ userType: "teacher", isAccountActive: false, isAccountPending: true, isAccountBanned: false })
            .then((teachers) => response.json(teachers))
            .catch((error) => console.log(error))
    }

    updateTeacherInfo = (request: express.Request, response: express.Response) => {
        let teacher = request.body
        UserModel.updateOne(
            {
                username: teacher.username
            },
            {
                name: teacher.name,
                surname: teacher.surname,
                address: teacher.address,
                phone: teacher.phone,
                email: teacher.email,
                profilePicturePath: teacher.profilePicturePath,
                teacherSubjects: teacher.teacherSubjects,
                teacherPreferredStudentsAge: teacher.teacherPreferredStudentsAge
            }
        ).then(
            () => {
                DataModel.findOne({}).then(
                    (data: any) => {
                        teacher.teacherSubjects.forEach(
                            (subject: any) => {
                                if (!data.subjects.includes(subject)) {
                                    data.subjects.push(subject)
                                }
                            }
                        )
                        DataModel.updateOne(
                            {},
                            {
                                subjects: data.subjects
                            }
                        ).then(() => response.json({ content: "ok" }))
                    }
                ).catch((error) => console.log(error))
            }
        ).catch((error) => console.log(error))
    }
}