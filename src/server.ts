import "dotenv/config";
import "./config/passport";
import App from "./app";
import authRouter from "./routes/auth";
import adRouter from "./routes/ad";
import categoryRouter from "./routes/category";
import subCategoryRouter from "./routes/subCategory";
import brandRouter from "./routes/brand";
import userRouter from "./routes/user";

const app = new App([authRouter, adRouter, subCategoryRouter, categoryRouter, userRouter, brandRouter]);
app.listen();

export default app;
