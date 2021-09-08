import "dotenv/config";
import "./config/passport";
import App from "./app";
import authRouter from "./routes/auth";
import adRouter from "./routes/ad";
import categoryRouter from "./routes/category";
import subCategoryRouter from "./routes/subCategory";
import brandRouter from "./routes/brand";
import provinceRouter from "./routes/province";
import cityRouter from "./routes/city";
import userRouter from "./routes/user";
import uploadRouter from "./routes/upload";

const app = new App([
    authRouter,
    adRouter,
    subCategoryRouter,
    categoryRouter,
    userRouter,
    brandRouter,
    provinceRouter,
    cityRouter,
    uploadRouter,
]);
app.listen();

export default app;
