const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const masterRoutes = require('./routes/masters');
const manpowerRoutes = require('./routes/manpower');
const hrRoutes = require('./routes/hr');
const cors = require('cors')

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/manpower', manpowerRoutes);
app.use('/api/hr', hrRoutes);

const port = process.env.PORT;
const startserver = async () => {
    await connectDB();
    app.listen(port ,()=>{
         console.log(`Server running on port ${port}`)
    })
}
startserver()