import express from "express"
import UserModel from "../models/user"

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
}