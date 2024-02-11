import express from "express"
import { UserModel } from "../models/user.model"
import multer from "multer"
import sizeOf from "image-size"
import * as fileSystem from "fs"
import * as bcrypt from "bcrypt"
import PendingTeachersModel from "../models/pending-teachers.model"

const NUMBER_OF_MILLISECONDS_IN_ONE_SECOND = 1000
const NUMBER_OF_SECONDS_IN_ONE_MINUTE = 60
const NUMBER_OF_MINUTES_IN_ONE_HOUR = 60

export class DefaultController {
    saltRounds: number = 10
    static currentRegisterAttemptDateTimeString: string = ""
    static currentProfilePictureFilePath: string = ""

    login = (request: express.Request, response: express.Response) => {
        UserModel.findOne(
            {
                username: request.body.username
            }
        ).then(
            (user) => {
                if (user != null && bcrypt.compareSync(request.body.password, user.password!)) {
                    response.json(user)
                } else {
                    response.json(null)
                }
            }
        ).catch(
            (error) => console.log(error)
        )
    }

    uploadProfilePicture = (request: express.Request, response: express.Response) => {
        let currentDateTimeString: string = this.getDateTimeString()
        DefaultController.currentRegisterAttemptDateTimeString = currentDateTimeString
        let extension: string = ""
        let filename: string = ""
        let filepath: string = ""
        const imagesStorage = multer.diskStorage({
            destination: (request, file, callback) => {
                callback(null, "./files/images")
            },
            filename: (request, file, callback) => {
                extension = file.originalname.substring(file.originalname.indexOf("."))
                filename = currentDateTimeString + extension
                filepath = "./files/images/" + filename
                DefaultController.currentProfilePictureFilePath = filepath
                callback(null, filename)
            }
        });
        const uploadMulter = multer({ storage: imagesStorage })
        uploadMulter.single("profilePicture")(request, response, (error) => {
            if (error) {
                console.log(error)
                response.status(500).json({ content: "Profile picture upload failed." })
            } else {
                const imageDimensions = sizeOf(filepath)
                const minImageWidth = 100
                const minImageHeight = 100
                const maxImageWidth = 300
                const maxImageHeight = 300
                if (imageDimensions.width! < minImageWidth
                    || imageDimensions.height! < minImageHeight
                    || imageDimensions.width! > maxImageWidth
                    || imageDimensions.height! > maxImageHeight
                ) {
                    fileSystem.unlinkSync(filepath)
                    response.json({
                        content: `ERROR|Image size is invalid (${imageDimensions.width}x${imageDimensions.height} px).`
                    })
                } else {
                    response.json({ content: `FILEPATH|${filepath}` })
                }
            }
        })
    }

    register = (request: express.Request, response: express.Response) => {
        let newUser: any = request.body
        const hashedPassword = bcrypt.hashSync(newUser.password, this.saltRounds)
        newUser.password = hashedPassword
        UserModel.findOne({ username: newUser.username }).then(
            (user) => {
                if (user != null) {
                    fileSystem.unlinkSync(newUser.profilePicturePath)
                    if (newUser.userType == "teacher") fileSystem.unlinkSync(newUser.cvPath)
                    response.json({ content: "This username is already taken." })
                } else {
                    UserModel.findOne({ email: newUser.email }).then(
                        (user) => {
                            if (user != null) {
                                fileSystem.unlinkSync(newUser.profilePicturePath)
                                if (newUser.userType == "teacher") fileSystem.unlinkSync(newUser.cvPath)
                                response.json({ content: "This email is already taken." })
                            } else {
                                if (newUser.userType == "student") {
                                    new UserModel(newUser).save().then(
                                        () => response.json({ content: "ok" })
                                    ).catch((error) => console.log(error))
                                } else {
                                    PendingTeachersModel.findOne({ username: newUser.username }).then(
                                        (user) => {
                                            if (user != null) {
                                                fileSystem.unlinkSync(newUser.profilePicturePath)
                                                fileSystem.unlinkSync(newUser.cvPath)
                                                response.json({ content: "This username is already taken." })
                                            } else {
                                                PendingTeachersModel.findOne({ email: newUser.email }).then(
                                                    (user) => {
                                                        if (user != null) {
                                                            fileSystem.unlinkSync(newUser.profilePicturePath)
                                                            fileSystem.unlinkSync(newUser.cvPath)
                                                            response.json({ content: "This email is already taken." })
                                                        } else {
                                                            new PendingTeachersModel(newUser).save().then(
                                                                () => response.json({ content: "ok" })
                                                            ).catch((error) => console.log(error))
                                                        }
                                                    }
                                                ).catch((error) => console.log(error))
                                            }
                                        }
                                    ).catch((error) => console.log(error))
                                }
                            }
                        }
                    ).catch((error) => console.log(error))
                }
            }
        ).catch((error) => console.log(error))
    }

    getNumberOfStudents = (request: express.Request, response: express.Response) => {
        UserModel.find({ userType: "student" }).then(
            (students: any[]) => {
                response.json({ content: students.length.toString() })
            }
        ).catch((error) => console.log(error))
    }

    checkOldPassword = (request: express.Request, response: express.Response) => {
        UserModel.findOne(
            {
                username: request.body.username
            }
        ).then(
            (user) => {
                if (user != null && bcrypt.compareSync(request.body.oldPassword, user.password!)) {
                    response.json(user)
                } else {
                    response.json(null)
                }
            }
        ).catch((error) => console.log(error))
    }

    changePassword = (request: express.Request, response: express.Response) => {
        const hashedPassword = bcrypt.hashSync(request.body.newPassword, this.saltRounds)
        UserModel.updateOne(
            {
                username: request.body.username
            },
            {
                password: hashedPassword
            }
        ).then(
            () => response.json({ content: "ok" })
        ).catch((error) => console.log(error))
    }

    getUser = (request: express.Request, response: express.Response) => {
        UserModel.findOne({ username: request.query.username }).then(
            (user) => response.json(user)
        ).catch((error) => console.log(error))
    }

    deleteProfilePicture = (request: express.Request, response: express.Response) => {
        fileSystem.unlinkSync(request.body.profilePicturePath)
        response.json({ content: "ok" })
    }

    getProfilePicture = (request: express.Request, response: express.Response) => {
        let filepath = request.body.filepath
        const profilePictureFile = fileSystem.readFileSync(filepath)
        const fileExtension = filepath.split(".").pop().toLocaleLowerCase()
        const contentType = "image/" + fileExtension
        response.contentType(contentType)
        response.send(profilePictureFile)
    }

    getDateTimeString(): string {
        let currentDateTimeInMillis = Date.now()
        currentDateTimeInMillis +=
            NUMBER_OF_MILLISECONDS_IN_ONE_SECOND * NUMBER_OF_SECONDS_IN_ONE_MINUTE * NUMBER_OF_MINUTES_IN_ONE_HOUR
        let currentDateTime = new Date(currentDateTimeInMillis)
        return currentDateTime.toISOString().replace(/:/g, "_").replace(/-/g, "_").replace(/\./g, "_")
    }
}