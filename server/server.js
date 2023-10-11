const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
app.use(express.json());
app.use(cors())

const usersRoute = require('./routes/usersRoute');
const inventoryRoute = require('./routes/inventoryRoute');
const dashboardRoute = require('./routes/dashboardRoute');

app.use('/api/users', usersRoute);
app.use('/api/inventory', inventoryRoute); 
app.use('/api/dashboard', dashboardRoute);

app.listen(port, () => console.log(`Node JS Server Started at ${port}`));



