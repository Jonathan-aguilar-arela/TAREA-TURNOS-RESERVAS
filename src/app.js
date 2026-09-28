import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { engine } from "express-handlebars";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  app.engine(
    "handlebars",
    engine({
      helpers: {
        eq: (a, b) => a === b,
        initials: (name = "") => String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toLocaleUpperCase("es"),
        statusLabel: (status) => ({ pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada" }[status] || status),
        isPopulatedService: (service) => Boolean(service && service.name),
      },
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "views"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Servidor activo — Semana 8" });
  });

  app.use("/api/services", servicesRouter);
  app.use("/api/bookings", bookingsRouter);
  app.use((req, res, next) => {
    res.locals.pageKind = req.path === "/" ? "home"
      : req.path.startsWith("/bookings") ? "bookings"
      : req.path === "/realtime" ? "realtime" : "services";
    next();
  });
  app.use("/", viewsRouter);

  app.use((req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ status: "error", message: "Ruta no encontrada" });
    }

    return res.status(404).render("not-found", {
      title: "No encontrado",
      message: "Esa página no existe",
    });
  });

  app.use(errorMiddleware);
  return app;
};

export default createApp();
