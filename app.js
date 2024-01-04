require("newrelic");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

var indexRouter = require("./routes/index");
const { clearImagesQueue } = require("./services/queue");

var app = express();
app.use(cookieParser());
app.use(cors());

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
