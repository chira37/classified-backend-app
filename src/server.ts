import "dotenv/config";
import "./config/passport";
import App from "./app";
import authRouter from "./routes/auth";
import adRouter from "./routes/ad";
import categoryRouter from "./routes/category";

import subCategoryRouter from "./routes/subCategory";

const app = new App([authRouter, adRouter, subCategoryRouter, categoryRouter]);
app.listen();

export default app;
