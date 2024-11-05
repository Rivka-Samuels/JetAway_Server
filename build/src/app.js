"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const appConfig_1 = require("./utils/appConfig");
const helpers_1 = require("./utils/helpers");
const catchAll_1 = __importDefault(require("./middlewares/catchAll"));
const logMW_1 = require("./middlewares/logMW");
const authControllers_1 = require("./controllers/authControllers");
const vacationControllers_1 = require("./controllers/vacationControllers");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const vacationFollowControllers_1 = require("./controllers/vacationFollowControllers");
// create server
const server = (0, express_1.default)();
// protect from dos attack 
// server.use(expressRateLimit({
// windowMs: 1000,  // time window
// max: 15,     // amount of calls (per time window)
// }))
// 
// cors
server.use((0, cors_1.default)());
// server.use(cors({original:["http://localhost:3000"]}));
// log
server.use(logMW_1.logMW);
// load body
server.use(express_1.default.json());
// load files
server.use((0, express_fileupload_1.default)());
// register controllers
server.use("/", authControllers_1.authRoutes);
server.use("/", vacationFollowControllers_1.vacationFollowRouter);
server.use("/", vacationControllers_1.vacationRouter);
// Setting path to images
// server.use('//api//v1//images', express.static(path.resolve(__dirname, '..', 'src', 'assets', 'images')));
// Error handling
server.use(catchAll_1.default);
// run server only if DB-server is active
(0, helpers_1.isDbServerUp)().then((isUp) => {
    if (isUp) {
        server.listen(appConfig_1.appConfig.port, () => {
            console.log(`Listening on http://localhost:${appConfig_1.appConfig.port}`);
        });
    }
    else {
        console.error("\n\n****\nDB server is not up!!!\n****\n");
    }
});
