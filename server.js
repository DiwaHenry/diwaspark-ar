const express = require('express'); 
const morgan = require('morgan');
const path = require('path');
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');
const webRoutes = require('./routes/webRoutes');

// init express application
const app = express();

// set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// request listen to port 3000
app.listen(process.env.PORT, 'localhost', () => {
    console.log("Server started...");
});

// middleware and static files like css, images and etc.
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/', webRoutes);




