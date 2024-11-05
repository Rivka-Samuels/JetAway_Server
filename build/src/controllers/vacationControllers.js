"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacationRouter = void 0;
const express_1 = __importDefault(require("express"));
const vacationService_1 = require("../services/vacationService");
const appConfig_1 = require("../utils/appConfig");
const statusEnum_1 = require("../models/statusEnum");
const vacationModel_1 = __importDefault(require("../models/vacationModel"));
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const path_1 = __importDefault(require("path"));
exports.vacationRouter = express_1.default.Router();
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
exports.vacationRouter.get(appConfig_1.appConfig.routePrefix + "/vacations-pg", authMiddlewares_1.verifyTokenMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, limit = 9 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const { vacations, total } = yield (0, vacationService_1.getVacationsPaginated)(pageNum, limitNum);
        res.status(statusEnum_1.StatusCode.Ok).json({
            vacations,
            total,
            totalPages: Math.ceil(total / limitNum)
        });
    }
    catch (error) {
        console.error('Error in /vacations-pg route:', error); // הדפסת השגיאה
        next(error);
    }
}));
// Path to receive all vacations
exports.vacationRouter.get(appConfig_1.appConfig.routePrefix + "/vacations", authMiddlewares_1.verifyTokenMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacations = yield (0, vacationService_1.getVacations)();
        res.status(statusEnum_1.StatusCode.Ok).json(vacations);
    }
    catch (error) {
        console.log(error);
        res.status(statusEnum_1.StatusCode.ServerError).send("Error. please try again later");
    }
}));
// Path to receive leave by ID
exports.vacationRouter.get(appConfig_1.appConfig.routePrefix + "/vacations/:id", authMiddlewares_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacation = yield (0, vacationService_1.getVacations)(+req.params.id);
        res.status(statusEnum_1.StatusCode.Ok).json(vacation[0]);
    }
    catch (error) {
        if (error.message.includes("vacation id not found")) {
            next(new Error("ID not found"));
            return;
        }
        console.log(error);
        res.status(statusEnum_1.StatusCode.ServerError).send("Error. please try again later");
    }
}));
// Path to add a new vacation
exports.vacationRouter.post(appConfig_1.appConfig.routePrefix + "/vacations", authMiddlewares_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // ודא שהקובץ הועלה כראוי
        const imageFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image; // הנחה שהקובץ נקרא 'image'
        if (!imageFile) {
            return res.status(statusEnum_1.StatusCode.BadRequest).send("Image file is required");
        }
        const newVacation = new vacationModel_1.default(req.body);
        yield (0, vacationService_1.addVacation)(newVacation, imageFile); // העבר את קובץ התמונה לפונקציה
        res.status(statusEnum_1.StatusCode.Ok).send("Vacation added successfully");
    }
    catch (error) {
        next(error);
    }
}));
// Path to update vacation by ID
exports.vacationRouter.put(`${appConfig_1.appConfig.routePrefix}/vacations/:id`, authMiddlewares_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const vacationId = +req.params.id; // המרת ה-ID למספר
        const vacationData = req.body; // מידע על החופשה
        const imageFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.imageFile; // קובץ התמונה, אם קיים
        // קריאה לפונקציה שלך לעדכון חופשה
        yield (0, vacationService_1.updateVacation)(vacationData, vacationId, imageFile);
        res.status(statusEnum_1.StatusCode.Ok).send("Vacation updated successfully");
    }
    catch (error) {
        next(error);
    }
}));
// Path to delete leave by ID
exports.vacationRouter.delete(appConfig_1.appConfig.routePrefix + "/vacations/:id", authMiddlewares_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacationId = +req.params.id; // Convert a vacation ID to a number
        yield (0, vacationService_1.deleteVacation)(vacationId);
        res.status(statusEnum_1.StatusCode.Ok).send("Vacation deleted successfully!"); // Sending response on success
    }
    catch (error) {
        console.error("Error deleting vacation:", error); // log the error
        res.status(statusEnum_1.StatusCode.ServerError).send("Failed to delete vacation."); // Sending an error message to the client
        next(error); // Passing the error to the error handling middlewares
    }
}));
exports.vacationRouter.get('/api/v1/images/:filename', (req, res) => {
    const filePath = path_1.default.join(__dirname, "..", "assets", "images", req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(statusEnum_1.StatusCode.ServerError).send("Error retrieving image");
        }
    });
});
