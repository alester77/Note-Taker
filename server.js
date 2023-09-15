const express = require('express');  
const app = express();
const PORT = process.env.PORT || 3000;
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

//parse URL and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//host public folder
app.use(express.static('public'));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});