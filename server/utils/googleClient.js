const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const TOKEN_PATH = path.join(__dirname, '../data/tokens.json');

// Ensure data dir exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'));
}

const getClient = () => {
    // Try to load tokens
    if (fs.existsSync(TOKEN_PATH)) {
        try {
            const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
            oauth2Client.setCredentials(tokens);
        } catch (e) {
            console.error("Error reading tokens.json", e);
        }
    }
    return oauth2Client;
};

const saveTokens = (tokens) => {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    oauth2Client.setCredentials(tokens);
};

const isAuthenticated = () => {
    return fs.existsSync(TOKEN_PATH);
};

module.exports = {
    getClient,
    saveTokens,
    isAuthenticated,
    REDIRECT_URI
};
