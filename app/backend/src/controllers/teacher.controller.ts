import express from "express"
import { DefaultController } from "./default.controller"
import multer from "multer"
import * as fileSystem from "fs"
import { UserModel } from "../models/user.model"
import DataModel from "../models/data.model"
import ClassModel from "../models/class.model"

const NUMBER_OF_BYTES_IN_ONE_KILOBYTE = 1024
const NUMBER_OF_KILOBYTES_IN_ONE_MEGABYTE = 1024

const NUMBER_OF_MINUTES_IN_ONE_HOUR = 60
const NUMBER_OF_SECONDS_IN_ONE_MINUTE = 60
const NUMBER_OF_MILLISECONDS_IN_ONE_SECOND = 1000

const NUMBER_OF_MILLISECONDS_IN_ONE_HOUR =
    NUMBER_OF_MINUTES_IN_ONE_HOUR * NUMBER_OF_SECONDS_IN_ONE_MINUTE * NUMBER_OF_MILLISECONDS_IN_ONE_SECOND
const NUMBER_OF_MILLISECONDS_IN_ONE_DAY = NUMBER_OF_MILLISECONDS_IN_ONE_HOUR * 24

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

    getTeachersTeachingSpecificStudentAge = (request: express.Request, response: express.Response) => {
        UserModel.find(
            {
                userType: "teacher",
                isAccountActive: true,
                isAccountPending: false,
                isAccountBanned: false,
                teacherPreferredStudentsAge: { $elemMatch: { $eq: request.query.studentAge } }
            }
        ).then(
            (teachers) => response.json(teachers)
        ).catch((error) => console.log(error))
    }

    updateWorktime = (request: express.Request, response: express.Response) => {
        let teacher = request.body
        UserModel.updateOne(
            {
                username: teacher.username
            },
            {
                workingDays: teacher.workingDays,
                workingHours: teacher.workingHours
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }

    getAllPendingClassRequests = (request: express.Request, response: express.Response) => {
        let teacherUsername = request.query.teacherUsername
        ClassModel.find(
            {
                teacherUsername: teacherUsername,
                isClassAccepted: false,
                isClassRejected: false,
                isClassCancelled: false,
                isClassDone: false,
                didClassRequestExpire: false
            }
        ).then(
            (classes: any[]) => {
                UserModel.find(
                    {
                        userType: "student"
                    }
                ).then(
                    (students: any[]) => {
                        let responseClasses: any[] = []
                        classes.forEach(
                            (classRequest: any) => {
                                let student = students.find((student) => student.username == classRequest.studentUsername)
                                responseClasses.push(
                                    {
                                        id: classRequest.id,
                                        studentUsername: classRequest.studentUsername,
                                        teacherUsername: classRequest.teacherUsername,
                                        subject: classRequest.subject,
                                        startDate: classRequest.startDate,
                                        endDate: classRequest.endDate,
                                        startTime: classRequest.startTime,
                                        endTime: classRequest.endTime,
                                        description: classRequest.description,
                                        isClassAccepted: classRequest.isClassAccepted,
                                        isClassRejected: classRequest.isClassRejected,
                                        isClassCancelled: classRequest.isClassCancelled,
                                        isClassDone: classRequest.isClassDone,
                                        didClassRequestExpire: classRequest.didClassRequestExpire,
                                        rejectionReason: classRequest.rejectionReason,

                                        studentName: student.name,
                                        studentSurname: student.surname
                                    }
                                )
                            }
                        )
                        response.json(responseClasses)
                    }
                ).catch((error) => console.log(error))
            }
        ).catch((error) => console.log(error))
    }

    deleteExpiredClassRequests = (request: express.Request, response: express.Response) => {
        let currentDateTimeInMillis = Date.now()
        let currentDateTime = this.convertMillisToDateTimeString(currentDateTimeInMillis + NUMBER_OF_MILLISECONDS_IN_ONE_HOUR)
        let currentDate = currentDateTime.substring(0, currentDateTime.indexOf(" "))
        let currentTime = currentDateTime.substring(currentDateTime.indexOf(" ") + 1)
        ClassModel.find({}).then(
            (classes: any[]) => {
                classes.forEach(
                    (classRequest: any) => {
                        if (!classRequest.isClassAccepted && !classRequest.isClassRejected
                            && !classRequest.isClassCancelled && !classRequest.isClassDone
                            && currentDate >= classRequest.startDate && currentTime >= classRequest.startTime) {
                            classRequest.didClassRequestExpire = true
                        }
                    }
                )
                ClassModel.deleteMany({}).then(
                    () => ClassModel.insertMany(classes).then(
                        () => response.json({ content: "ok" })
                    ).catch((error) => console.log(error))
                ).catch((error) => console.log(error))
            }
        ).catch((error) => console.log(error))
    }

    acceptClassRequest = (request: express.Request, response: express.Response) => {
        let classRequest = request.body
        ClassModel.updateOne(
            {
                id: classRequest.id
            },
            {
                isClassAccepted: true
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }

    rejectClassRequest = (request: express.Request, response: express.Response) => {
        let classRequest = request.body
        ClassModel.updateOne(
            {
                id: classRequest.id
            },
            {
                isClassRejected: true,
                rejectionReason: classRequest.rejectionReason
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }

    getAllAcceptedClassesForNextThreeDays = (request: express.Request, response: express.Response) => {
        let teacherUsername = request.query.teacherUsername

        let currentDateTimeInMillis = Date.now() + NUMBER_OF_MILLISECONDS_IN_ONE_HOUR
        let finalDateTimeInMillis = currentDateTimeInMillis + 3 * NUMBER_OF_MILLISECONDS_IN_ONE_DAY

        let currentDateTimeString = this.convertMillisToDateTimeString(currentDateTimeInMillis)
        let finalDateTimeString = this.convertMillisToDateTimeString(finalDateTimeInMillis)

        let currentDateString = currentDateTimeString.substring(0, finalDateTimeString.indexOf(" "))
        let finalDateString = finalDateTimeString.substring(0, finalDateTimeString.indexOf(" "))
        ClassModel.find(
            {
                teacherUsername: teacherUsername,
                isClassAccepted: true,
                isClassRejected: false,
                isClassCancelled: false,
                isClassDone: false,
                $and: [
                    {
                        startDate: { $gte: currentDateString }
                    },
                    {
                        startDate: { $lte: finalDateString }
                    }
                ]
            }
        ).sort(
            {
                startDate: "ascending",
                startTime: "ascending"
            }
        ).then(
            (classes: any[]) => {
                UserModel.find(
                    {
                        userType: "student"
                    }
                ).then(
                    (students: any[]) => {
                        let responseClasses: any[] = []
                        classes.forEach(
                            (classRequest: any) => {
                                let student = students.find((student) => student.username == classRequest.studentUsername)
                                responseClasses.push(
                                    {
                                        id: classRequest.id,
                                        studentUsername: classRequest.studentUsername,
                                        teacherUsername: classRequest.teacherUsername,
                                        subject: classRequest.subject,
                                        startDate: classRequest.startDate,
                                        endDate: classRequest.endDate,
                                        startTime: classRequest.startTime,
                                        endTime: classRequest.endTime,
                                        description: classRequest.description,
                                        isClassAccepted: classRequest.isClassAccepted,
                                        isClassRejected: classRequest.isClassRejected,
                                        isClassCancelled: classRequest.isClassCancelled,
                                        isClassDone: classRequest.isClassDone,
                                        didClassRequestExpire: classRequest.didClassRequestExpire,
                                        rejectionReason: classRequest.rejectionReason,

                                        studentName: student.name,
                                        studentSurname: student.surname
                                    }
                                )
                            }
                        )
                        response.json(responseClasses)
                    }
                ).catch((error) => console.log(error))
            }
        ).catch((error) => console.log(error))
    }

    convertMillisToDateTimeString(dateTimeInMillis: number): string {
        let currentDateTime = new Date(dateTimeInMillis).toISOString()
        let currentDate = currentDateTime.substring(0, currentDateTime.indexOf("T"))
        let currentTime = currentDateTime.substring(currentDateTime.indexOf("T") + 1, currentDateTime.indexOf("."))
        currentDateTime = currentDate + " " + currentTime
        return currentDateTime
    }
}