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

    isTimeSlotTaken = (request: express.Request, response: express.Response) => {
        let classRequest = request.body
        let newStartDate = classRequest.startDate
        let newEndDate = classRequest.endDate
        let newStartTime = classRequest.startTime
        let newEndTime = classRequest.endTime

        if (newEndTime == "00:00") {
            newEndTime = "24:00"
            newEndDate = newStartDate
        }

        ClassModel.find(
            {
                $or: [{ isClassAccepted: true }, { isClassAccepted: false }],
                isClassRejected: false,
                isClassCancelled: false,
                isClassDone: false,
                didClassRequestExpire: false
            }
        ).then(
            (classes: any[]) => {
                let responseClasses: any[] = []
                classes.forEach(
                    (classObject: any) => {
                        let existingStartDate = classObject.startDate
                        let existingEndDate = classObject.endDate
                        let existingStartTime = classObject.startTime
                        let existingEndTime = classObject.endTime

                        if (existingEndTime == "00:00") {
                            existingEndDate = existingStartDate
                            existingEndTime = "24:00"
                        }

                        if (existingStartDate == newStartDate) {
                            if (existingStartDate == existingEndDate) {
                                if (newStartDate == newEndDate) {
                                    let condition1: boolean = newEndTime > existingStartTime && newEndTime < existingEndTime
                                    let condition2: boolean = newStartTime > existingStartTime && newStartTime < existingEndTime
                                    let condition3: boolean = newStartTime == existingStartTime && newEndTime == existingEndTime
                                    if (condition1 || condition2 || condition3) responseClasses.push(classObject)
                                } else {
                                    if (newStartTime >= existingStartTime && newStartTime < existingEndTime)
                                        responseClasses.push(classObject)
                                }
                            } else {
                                if (newStartDate == newEndDate) {
                                    if (existingStartTime >= newStartTime && existingStartTime < newEndTime)
                                        responseClasses.push(classObject)
                                } else {
                                    responseClasses.push(classObject)
                                }
                            }
                        } else if (existingEndDate == newStartDate) {
                            if (newStartTime < existingEndTime) responseClasses.push(classObject)
                        } else if (existingStartDate == newEndDate) {
                            if (existingStartTime < newEndTime) responseClasses.push(classObject)
                        }
                    }
                )
                response.json(responseClasses)
            }
        ).catch((error) => console.log(error))
    }

    getAllUpcomingClasses = (request: express.Request, response: express.Response) => {
        let studentUsername = request.query.studentUsername
        ClassModel.find(
            {
                studentUsername: studentUsername,
                isClassAccepted: true,
                isClassRejected: false,
                isClassCancelled: false,
                isClassDone: false
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
                        userType: "teacher"
                    }
                ).then(
                    (teachers: any[]) => {
                        let responseClasses: any[] = []
                        classes.forEach(
                            (classRequest: any) => {
                                let teacher = teachers.find((teacher) => teacher.username == classRequest.teacherUsername)
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
                                        cancellationReason: classRequest.cancellationReason,

                                        teacherName: teacher.name,
                                        teacherSurname: teacher.surname
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
}