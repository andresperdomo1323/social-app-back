const { OAuth2Client } = require('google-auth-library');
const clientID = process.env.CLIENT_ID;
const client = new OAuth2Client(clientID);

class AuthService {
    async validateToken(token) {
        try {
            const verify = await client.verifyIdToken({
                idToken: token,
                audience: clientID
            });

            const user = verify.getPayload();
            return user;

        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = AuthService;