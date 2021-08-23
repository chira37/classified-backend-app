import "dotenv/config";
import "./config/passport";
import App from "./app";
import authRouter from "./routes/auth";

const app = new App([authRouter]);
app.listen();

export default app;
