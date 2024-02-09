import express from "express"
import UserModel from "../models/user.model"
import multer from "multer"

export class DefaultController {
    login = (request: express.Request, response: express.Response) => {
        UserModel.findOne(
            {
                username: request.body.username,
                password: request.body.password
            }
        ).then(
            (user) => response.status(200).json(user)
        ).catch(
            (error) => console.log(error)
        )
    }

    register = (request: express.Request, response: express.Response) => {
        const imagesStorage = multer.diskStorage({
            destination: (request, file, callback) => {
                callback(null, "./files/images")
            },
            filename: (request, file, callback) => {
                callback(null, "username" + file.originalname.substring(file.originalname.indexOf(".")))
            },
        });
        const uploadMulter = multer({ storage: imagesStorage })
        uploadMulter.single("profilePicture")(request, response, (error) => {
            if (error) {
                console.log(error)
                response.status(500).json({ content: "error" })
            } else {
                response.status(200).json({ content: "ok" })
            }
        })
    }
}