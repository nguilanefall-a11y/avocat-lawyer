const express = require('express');
const router = express.Router();
const googleClient = require('../utils/googleClient');

router.get('/google', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose'
    ];

    const client = googleClient.getClient();

    const url = client.generateAuthUrl({
        access_type: 'offline', // Requests refresh_token
        scope: scopes,
        prompt: 'consent' // Force approval to ensure refresh token is returned
    });

    res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    const client = googleClient.getClient();

    try {
        const { tokens } = await client.getToken(code);
        googleClient.saveTokens(tokens);

        console.log("Google Auth Success! Tokens saved.");
        res.redirect('http://localhost:5173/?auth=success'); // Redirect to frontend
    } catch (error) {
        console.error('Error during Google Auth callback:', error);
        res.status(500).send('Authentication failed');
    }
});

router.get('/status', (req, res) => {
    res.json({ connected: googleClient.isAuthenticated() });
});

module.exports = router;
