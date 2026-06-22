const express=require('express');//accquire exprees library for api create
const dotenv=require('dotenv');//dot env file connection
const cors = require('cors');//connecting recat
const connectionDB=require('./config/db');
const messageRoutes=require('./routes/messageRoutes');//message route
const conversationRoutes=require('./routes/conversationRoutes');//conversation route
const authRoutes=require('./routes/authRoutes');//auth route


dotenv.config();
connectionDB();

const app=express();
app.use(express.json());//json data
app.use(cors());
app.use('/api/messages',messageRoutes);
app.use('/api/conversations',conversationRoutes);
app.use('/api/auth',authRoutes);

app.get('/',(req,res)=>{
    res.send('API is running...');
});


const PORT=process.env.PORT ||5000;//run

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});