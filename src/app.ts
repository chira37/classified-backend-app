import express, { Application, Response, Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "./middleware/morgan";
import config from "./config";
import { httpResponse } from "./utils/constants";

class App {
    public app: Application;
    constructor(routers: Router[]) {
        this.app = express();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeDevelopmentMiddlewares();
        this.initializeRouters(routers);
    }

    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(cors());
    }

    private initializeDevelopmentMiddlewares() {
        if (config.env !== "test") {
            this.app.use(morgan);
        }
    }

    private initializeRouters(routers: Router[]) {
        routers.forEach((router: Router) => {
            this.app.use("/api", router);
        });
    }

    private connectToDatabase() {
        const mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };

        mongoose
            .connect(config.dbUrl, mongooseOptions)
            .then(() => console.log("connected to database"))
            .catch((error) => console.log("ERROR:", error));
    }
}

export default App;
