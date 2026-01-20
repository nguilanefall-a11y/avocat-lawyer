const { google } = require('googleapis');
const googleClient = require('../utils/googleClient');

const getGmailService = () => {
    const auth = googleClient.getClient();
    return google.gmail({ version: 'v1', auth });
};

// Internal helper to get unread emails content
exports.fetchUnreadEmails = async () => {
    if (!googleClient.isAuthenticated()) return [];

    try {
        const gmail = getGmailService();
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'is:unread',
            maxResults: 10
        });

        const messages = response.data.messages || [];
        if (messages.length === 0) return [];

        const fullMessages = await Promise.all(messages.map(async (msg) => {
            try {
                const details = await gmail.users.messages.get({ userId: 'me', id: msg.id });
                const headers = details.data.payload.headers;
                const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
                const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
                const date = headers.find(h => h.name === 'Date')?.value || '';

                return {
                    id: msg.id,
                    from,
                    subject,
                    date,
                    snippet: details.data.snippet
                };
            } catch (e) {
                return null;
            }
        }));

        return fullMessages.filter(m => m !== null);
    } catch (error) {
        console.error("Gmail Fetch Error", error);
        return [];
    }
};

exports.listUnread = async (req, res) => {
    const emails = await exports.fetchUnreadEmails();
    res.json({ success: true, count: emails.length, messages: emails });
};
