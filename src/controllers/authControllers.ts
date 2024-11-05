import { NextFunction, Request, Response, Router } from "express";
import { appConfig } from "../utils/appConfig";
import UserModel from "../models/userModel";
import { createUser, login } from "../services/authService";
import { StatusCode } from "../models/statusEnum";


export const authRoutes = Router();


authRoutes.post(appConfig.routePrefix + "/register", 
    async (req: Request, res: Response, next: NextFunction)=>{
        try {
          const user = new UserModel(req.body);
          const token = await createUser(user);
          res.status(StatusCode.Created).json(token)
        } catch (error) {
            next(error);
        }        
    })

authRoutes.post(appConfig.routePrefix + "/login", 
    async (req: Request, res: Response, next: NextFunction)=>{
        try {
          const email = req.body.email;
          const password = req.body.password;
          const token = await login(email, password);
          res.status(StatusCode.Ok).json(token)
        } catch (error) {
            next(error);
        }        
    })