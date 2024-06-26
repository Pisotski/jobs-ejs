const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const MongoDBStore = require("connect-mongodb-session")(session);
require("express-async-errors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const url = process.env.MONGO_URI;
const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");

const app = express();

app.set("view engine", "ejs");

const store = new MongoDBStore({
	// may throw an error, which won't be caught
	uri: url,
	collection: "mySessions",
});
store.on("error", function (error) {
	console.log(error);
});

const sessionParms = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: store,
	cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
	app.set("trust proxy", 1); // trust first proxy
	sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));
app.use(require("connect-flash")());

passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("./middleware/storeLocals"));
app.use("/secretWord", auth, secretWordRouter);

app.get("/", (req, res) => {
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
