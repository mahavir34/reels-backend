const express = require('express');
const path = require('path');
const cors = require('cors');
const reelRoutes = require('./routes/reelRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/edited', express.static(path.join(__dirname, 'edited')));

// Routes
app.use('/api', reelRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
