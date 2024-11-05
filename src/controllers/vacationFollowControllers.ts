import express, { NextFunction, Request, Response } from "express";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import { addFollow, deleteFollow, getFollowers, getVacationFollowedByUser } from "../services/vacationFollowService";

export const vacationFollowRouter = express.Router();

// **Controller for receiving followers by vacation ID**
vacationFollowRouter.get(appConfig.routePrefix + "/vacation-follows/:vacationId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vacationId = +req.params.vacationId;        
            if (isNaN(vacationId) || vacationId <= 0) {
                console.warn(`Invalid vacation ID: ${vacationId}`);
                return res.status(StatusCode.BadRequest).json({ message: "Invalid vacation ID" });
            }       
            const followers = await getFollowers(vacationId);
            res.status(StatusCode.Ok).json(followers);
        } catch (error) {
            console.error('Error in GET /vacation-follows/:vacationId:', error);
            next(error);
        }
    }
);

// **Controller for receiving vacations tracked by user by user ID**
vacationFollowRouter.get(appConfig.routePrefix + "/user-follows/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = +req.params.userId; 
            if (isNaN(userId) || userId <= 0) {
                console.warn(`Invalid user ID: ${userId}`);
                return res.status(StatusCode.BadRequest).json({ message: "Invalid user ID" });
            }
            // console.log(`Request received to get vacations followed by userId=${userId}`);
            const vacations = await getVacationFollowedByUser(userId);
            res.status(StatusCode.Ok).json(vacations);
        } catch (error) {
            console.error('Error in GET /user-follows/:userId:', error);
            next(error);
        }
    }
);

// **Controller for adding a follower between a user and a vacation**
vacationFollowRouter.post(appConfig.routePrefix + "/follow/:userId/:vacationId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = +req.params.userId;
            const vacationId = +req.params.vacationId; 
            if (isNaN(userId) || userId <= 0 || isNaN(vacationId) || vacationId <= 0) {
                console.warn(`Invalid user ID or vacation ID: userId=${userId}, vacationId=${vacationId}`);
                return res.status(StatusCode.BadRequest).json({ message: "Invalid user ID or vacation ID" });
            }         
            // console.log(`Request received to add follow: userId=${userId}, vacationId=${vacationId}`);
            await addFollow(userId, vacationId);
            res.status(StatusCode.Created).send("Follow added successfully");
        } catch (error) {
            console.error('Error in POST /follow/:userId/:vacationId:', error);
            next(error);
        }
    }
);

// **Controller for deleting a follower between a user and a vacation**
vacationFollowRouter.delete(appConfig.routePrefix + "/follow/:userId/:vacationId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = +req.params.userId;
            const vacationId = +req.params.vacationId;   
            if (isNaN(userId) || userId <= 0 || isNaN(vacationId) || vacationId <= 0) {
                console.warn(`Invalid user ID or vacation ID: userId=${userId}, vacationId=${vacationId}`);
                return res.status(StatusCode.BadRequest).json({ message: "Invalid user ID or vacation ID" });
            }         
            // console.log(`Request received to delete follow: userId=${userId}, vacationId=${vacationId}`);
            await deleteFollow(userId, vacationId);
            res.status(StatusCode.Ok).send("Follow deleted successfully");
        } catch (error) {
            console.error('Error in DELETE /follow/:userId/:vacationId:', error);
            next(error);
        }
    }
);
