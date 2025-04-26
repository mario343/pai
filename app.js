const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bidRoutes = require('./routes/bidRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', bidRoutes);

app.listen(3000, () => console.log('BidPortal running on http://localhost:3000'));
