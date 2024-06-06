const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const csrf = require("host-csrf");
const passportInit = require("./passport/passportInit");
const MongoDBStore = require("connect-mongodb-session")(session);
require("express-async-errors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const url = process.env.MONGO_URI;
const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
const moviesRouter = require("./routes/moviesRoutes");

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(require("body-parser").urlencoded({ extended: true }));

const store = new MongoDBStore({
	// may throw an error, which won't be caught
	uri: url,
	collection: "mySessions",
});

store.on("error", function (error) {
	console.log(error);
});

/************************************************/
/***************** PASSPORT *********************/
const sessionParms = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: store,
	cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
	app.set("trust proxy", 1);
	sessionParms.cookie.secure = true;
}

app.use(session(sessionParms));
app.use(require("connect-flash")());

app.use(passport.initialize());
app.use(passport.session());
passportInit();
/**************** /PASSPORT *********************/
/************************************************/

/************************************************/
/******************* CSRF ***********************/
app.use(express.urlencoded({ extended: false }));
let csrf_development_mode = true;
if (app.get("env") === "production") {
	csrf_development_mode = false;
	app.set("trust proxy", 1);
}
const csrf_options = {
	protected_operations: ["PATCH", "POST"],
	protected_content_types: ["application/json"],
	development_mode: csrf_development_mode,
};
const csrf_middleware = csrf(csrf_options);

/****************** /CSRF ***********************/
/************************************************/

app.use(require("./middleware/storeLocals"));
app.use("/secretWord", auth, csrf_middleware, secretWordRouter);
app.use("/jobs", auth, csrf_middleware, moviesRouter);

app.get("/", csrf_middleware, (req, res) => {
	res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

app.use((req, res) => {
	res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
	res.status(500).send(err.message);
	console.log(err);
});

const start = async () => {
	try {
		await require("./db/connect")(process.env.MONGO_URI);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
