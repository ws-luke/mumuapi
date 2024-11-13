const express = require('express');
const app = express();
const user = require('./routes/userRoutes');

app.use('/user',user);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});