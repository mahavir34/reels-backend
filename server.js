const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const reelRoutes = require('./routes/reelRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// आवश्यक फ़ोल्डर्स सुनिश्चित करें
const dirs = ['uploads', 'edited'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Full Permissive CORS (Mobile Compatibility Fix)
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Debugger Logger (हर रिक्वेस्ट लॉग करने के लिए)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/edited', express.static(path.join(__dirname, 'edited')));

// Routes
app.use('/api', reelRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
