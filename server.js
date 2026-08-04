const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const reelRoutes = require('./routes/reelRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use('/edited', express.static('edited'));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('edited')) fs.mkdirSync('edited');

app.use('/api', reelRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});
