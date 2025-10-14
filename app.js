require("newrelic");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cors = require("cors");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

var indexRouter = require("./routes/index");
const { clearImagesQueue } = require("./services/queue");

var app = express();

// Configure CORS for OG image routes only
const ogImageCorsOptions = {
    origin: function (origin, callback) {
        // Check if CORS restriction is enabled
        const corsEnabled = process.env.ENABLE_CORS_RESTRICTION === "true";

        if (!corsEnabled) {
            // CORS restriction disabled, allow all origins
            return callback(null, true);
        }

        if (!origin) {
            return callback(null, true);
        }

        // Get allowed origins from environment variable
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
            .split(",")
            .map((origin) => origin.trim())
            .filter((origin) => origin.length > 0);

        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Check for wildcard subdomain support (e.g., *.example.com)
        const isAllowed = allowedOrigins.some((allowedOrigin) => {
            if (allowedOrigin.startsWith("*.")) {
                const domain = allowedOrigin.substring(2); // Remove *.
                return origin.endsWith("." + domain) || origin === domain;
            }
            return false;
        });

        if (isAllowed) {
            return callback(null, true);
        }

        console.log(`CORS: Blocked request from origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply unrestricted CORS to queues
app.use("/queues", cors());

// Apply restricted CORS to OG image routes
app.use("/og-image", cors(ogImageCorsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/og-image/static", express.static(path.join(__dirname, "public")));

// Queue monitor
const serverAdapter = new ExpressAdapter();
createBullBoard({
    queues: [new BullAdapter(clearImagesQueue)],
    serverAdapter: serverAdapter,
});
serverAdapter.setBasePath("/queues");
app.use("/queues", serverAdapter.getRouter());

// Main router
app.use("/", indexRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
