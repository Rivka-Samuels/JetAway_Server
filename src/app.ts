import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { appConfig } from "./utils/appConfig";
import { isDbServerUp } from "./utils/helpers";
import catchAll from "./middlewares/catchAll";
import { logMW } from "./middlewares/logMW";
import { authRoutes } from "./controllers/authControllers";
import { vacationRouter } from "./controllers/vacationControllers";
import expressRateLimit from "express-rate-limit";
import expressFileUpload from "express-fileupload"
import { vacationFollowRouter } from "./controllers/vacationFollowControllers";
import path from "path";

// create server
const server = express();

// protect from dos attack 
// server.use(expressRateLimit({
    // windowMs: 1000,  // time window
    // max: 15,     // amount of calls (per time window)
// }))
// 
// cors
server.use(cors());

// server.use(cors({original:["http://localhost:3000"]}));

// log
server.use(logMW);

// load body
server.use(express.json());

// load files
server.use(expressFileUpload())

// register controllers
server.use("/", authRoutes);
server.use("/", vacationFollowRouter);
server.use("/", vacationRouter);


// Setting path to images
// server.use('//api//v1//images', express.static(path.resolve(__dirname, '..', 'src', 'assets', 'images')));

// Error handling
server.use(catchAll);

// run server only if DB-server is active
isDbServerUp().then((isUp) => {
    if (isUp) {
        server.listen(appConfig.port, () => {
            console.log(`Listening on http://localhost:${appConfig.port}`);
        })
    } else {
        console.error("\n\n****\nDB server is not up!!!\n****\n");
    }
})
