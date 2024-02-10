import express from "express"
import UserModel from "../models/user.model"
import multer from "multer"
import sizeOf from "image-size"
import * as fileSystem from "fs"

const NUMBER_OF_MILLISECONDS_IN_ONE_SECOND = 1000
const NUMBER_OF_SECONDS_IN_ONE_MINUTE = 60
const NUMBER_OF_MINUTES_IN_ONE_HOUR = 60

export class DefaultController {
    login = (request: express.Request, response: express.Response) => {
        UserModel.findOne(
            {
                username: request.body.username,
                password: request.body.password
            }
        ).then(
            (user) => response.json(user)
        ).catch(
            (error) => console.log(error)
        )
    }

    uploadProfilePicture = (request: express.Request, response: express.Response) => {
        let currentDateTimeString: string = this.getDateTimeString()
        let extension: string = ""
        let filename: string = ""
        const imagesStorage = multer.diskStorage({
            destination: (request, file, callback) => {
                callback(null, "./files/images")
            },
            filename: (request, file, callback) => {
                extension = file.originalname.substring(file.originalname.indexOf("."))
                filename = currentDateTimeString + extension
                callback(null, filename)
            }
        });
        const uploadMulter = multer({ storage: imagesStorage })
        uploadMulter.single("profilePicture")(request, response, (error) => {
            if (error) {
                console.log(error)
                response.status(500).json({ content: "Image upload failed." })
            } else {
                const imageDimensions = sizeOf(`./files/images/${filename}`)
                const minImageWidth = 100
                const minImageHeight = 100
                const maxImageWidth = 300
                const maxImageHeight = 300
                if (imageDimensions.width! < minImageWidth
                    || imageDimensions.height! < minImageHeight
                    || imageDimensions.width! > maxImageWidth
                    || imageDimensions.height! > maxImageHeight
                ) {
                    fileSystem.unlink(`./files/images/${filename}`, (error) => {
                        if (error) console.log(error)
                    })
                    response.json({
                        content: `ERROR|Image size is invalid (${imageDimensions.width}x${imageDimensions.height} px).`
                    })
                } else {
                    response.json({ content: `FILEPATH|./files/images/${filename}` })
                }
            }
        })
    }

    register = (request: express.Request, response: express.Response) => {
        let newUser: any = request.body
        UserModel.findOne({ username: newUser.username }).then(
            (user) => {
                if (user != null) {
                    fileSystem.unlink(newUser.profilePicturePath, (error) => {
                        if (error) console.log(error)
                    })
                    response.json({ content: "This username is already taken." })
                } else {
                    UserModel.findOne({ email: newUser.email }).then(
                        (user) => {
                            if (user != null) {
                                fileSystem.unlink(newUser.profilePicturePath, (error) => {
                                    if (error) console.log(error)
                                })
                                response.json({ content: "This email is already taken." })
                            } else {
                                new UserModel(newUser).save().then(
                                    () => response.json({ content: "ok" })
                                ).catch((error) => console.log(error))
                            }
                        }
                    ).catch((error) => console.log(error))
                }
            }
        ).catch((error) => console.log(error))
    }

    getDateTimeString(): string {
        let currentDateTimeInMillis = Date.now()
        currentDateTimeInMillis +=
            NUMBER_OF_MILLISECONDS_IN_ONE_SECOND * NUMBER_OF_SECONDS_IN_ONE_MINUTE * NUMBER_OF_MINUTES_IN_ONE_HOUR
        let currentDateTime = new Date(currentDateTimeInMillis)
        return currentDateTime.toISOString().replace(/:/g, "_").replace(/-/g, "_").replace(/\./g, "_")
    }
}