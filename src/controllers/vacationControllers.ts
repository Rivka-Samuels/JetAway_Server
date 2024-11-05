import express, { Request, Response, NextFunction } from "express";
import { addVacation, getVacations, getVacationsPaginated, updateVacation, deleteVacation } from "../services/vacationService";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import VacationModel from "../models/vacationModel";
import { verifyTokenAdminMW, verifyTokenMW } from "../middlewares/authMiddlewares";
import path from "path";
import { UploadedFile } from "express-fileupload";

export const vacationRouter = express.Router();

// A path for receiving vacations with the option to browse
// vacationRouter.get(appConfig.routePrefix + "/vacations-pg", verifyTokenMW,
    // async (req: Request, res: Response, next: NextFunction) => {
        // try {
            // const {page=0, limit=10} = req.query;
            // const vacations = await getVacationsPaginated(page as number, limit as number);
            // res.status(StatusCode.Ok).json(vacations);
        // } catch (error) {
            // next(error);
        // }
    // }
// );


vacationRouter.get(appConfig.routePrefix + "/vacations-pg", verifyTokenMW,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page = 0, limit = 9 } = req.query;
            const pageNum = Number(page);
            const limitNum = Number(limit);
            const { vacations, total } = await getVacationsPaginated(pageNum, limitNum);
            res.status(StatusCode.Ok).json({
                vacations,
                total,
                totalPages: Math.ceil(total / limitNum)
            });
        } catch (error) {
            console.error('Error in /vacations-pg route:', error); // הדפסת השגיאה
            next(error);
        }
    }
);


// Path to receive all vacations
vacationRouter.get(appConfig.routePrefix + "/vacations", verifyTokenMW, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vacations = await getVacations();
        res.status(StatusCode.Ok).json(vacations);
    } catch (error) {
        console.log(error);
        res.status(StatusCode.ServerError).send("Error. please try again later");
    }
});

// Path to receive leave by ID
vacationRouter.get(appConfig.routePrefix + "/vacations/:id", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vacation = await getVacations(+req.params.id);
        res.status(StatusCode.Ok).json(vacation[0]);
    } catch (error) {

        if (error.message.includes("vacation id not found")) {
            next(new Error("ID not found"));
            return;
        }

        console.log(error);
        res.status(StatusCode.ServerError).send("Error. please try again later");
    }
});

// Path to add a new vacation
vacationRouter.post(appConfig.routePrefix + "/vacations", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ודא שהקובץ הועלה כראוי
        const imageFile = req.files?.image as UploadedFile; // הנחה שהקובץ נקרא 'image'

        if (!imageFile) {
            return res.status(StatusCode.BadRequest).send("Image file is required");
        }

        const newVacation = new VacationModel(req.body);
        await addVacation(newVacation, imageFile); // העבר את קובץ התמונה לפונקציה
        res.status(StatusCode.Ok).send("Vacation added successfully");
    } catch (error) {
        next(error);
    }
});


// Path to update vacation by ID
vacationRouter.put(`${appConfig.routePrefix}/vacations/:id`, verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {

    try {
        const vacationId = +req.params.id; // המרת ה-ID למספר
        const vacationData = req.body; // מידע על החופשה
        const imageFile = req.files?.imageFile as UploadedFile; // קובץ התמונה, אם קיים

        // קריאה לפונקציה שלך לעדכון חופשה
        await updateVacation(vacationData, vacationId, imageFile);
        res.status(StatusCode.Ok).send("Vacation updated successfully");
    } catch (error) {
        next(error);
    }
});


// Path to delete leave by ID
vacationRouter.delete(appConfig.routePrefix + "/vacations/:id", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vacationId = +req.params.id; // Convert a vacation ID to a number
        await deleteVacation(vacationId);
        res.status(StatusCode.Ok).send("Vacation deleted successfully!"); // Sending response on success
    } catch (error) {
        console.error("Error deleting vacation:", error); // log the error
        res.status(StatusCode.ServerError).send("Failed to delete vacation.");// Sending an error message to the client
        next(error); // Passing the error to the error handling middlewares
    }
});




vacationRouter.get('/api/v1/images/:filename', (req, res) => {
    const filePath = path.join(__dirname, "..", "assets", "images", req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(StatusCode.ServerError).send("Error retrieving image");
        }
    });
});
