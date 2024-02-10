import express from "express"
import { DefaultController } from "./default.controller"
import multer from "multer"
import * as fileSystem from "fs"

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
}