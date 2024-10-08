import express from "express";
import compression from "compression";

const app = express();

app.use(compression());

app.use(express.static("public"));

app.use((error, _, res, next) => {
    if (res.headersSent) return next(error);
    res.status(500).json({
        message: "Something went wrong. Please try again.",
    });
});

app.listen(3000, () => {
    console.log("server started on http://localhost:3000");
});
