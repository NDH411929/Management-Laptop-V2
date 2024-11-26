const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const cron = require("node-cron");
const Coupon = require("./models/coupon.model");
const database = require("./config/database");
const route = require("./routers/client/index.route");
const routeAdmin = require("./routers/admin/index.route");
const systemConfig = require("./config/system");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

//Declare PUG
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

//Connect database
database.connect();

//App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

//Override method
app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//
app.use(cookieParser("nguyenduchuy"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//Allow the "public" folder to be public
app.use(express.static(__dirname + "/public"));

// New Route to the TinyMCE Node module
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Update expire date
cron.schedule("* * * * *", async () => {
    //Taọ thời gian hiện tại
    const today = new Date();
    try {
        await Coupon.updateMany(
            { expirationDate: { $lte: today }, status: "active" },
            { $set: { status: "expired" } }
        );
    } catch (error) {
        console.error("Lỗi khi chạy cron job:", error);
    }
});

//Route client
route(app);
//Route admin
routeAdmin(app);

//exception
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        title: "404 Not Found",
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
