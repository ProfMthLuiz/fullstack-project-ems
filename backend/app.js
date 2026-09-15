import express from 'express';
import path from "path";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ProdutosRoutes from './routes/product.routes.js';
import CategoryRoutes from "./routes/category.routes.js";
import ImageRoutes from "./routes/image.routes.js";
import UserRoutes from "./routes/user.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', "http://10.144.170.200:5173"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

// http://localhost:3000/produtos
app.use("/categories", CategoryRoutes);
app.use("/products", ProdutosRoutes);
app.use("/images", ImageRoutes);

app.use("/users", UserRoutes);
app.use("/auth", AuthRoutes);

app.use(errorHandler);

export default app;









