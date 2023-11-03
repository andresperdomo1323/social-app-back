const { OAuth2Client } = require('google-auth-library');
const clientID = process.env.CLIENT_ID;
const client = new OAuth2Client(clientID);
const userSchema = require('../models/user');


exports.loginGoogle = async (req, res, next) => {
    const { token } = req.body;
    console.log(token);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientID
    });
    const { name, picture, email } = ticket.getPayload();
    let user = await userSchema.findOne({ email });
    if(!user){
       user = await new userSchema({ name, email, picture }).save();
    }
    req.session.userId = user._id;
    res.send({ message: 'Inicio de sesión exitoso!' });
}

async function verifyGoogleToken(token) {
    const client = new OAuth2Client(clientID);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientID, // Verify the audience matches your app's client ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // Perform further actions using the verified userid
        return userid;
    } catch (error) {
        // Handle the error appropriately
        console.error('Token verification error:', error);
        throw error;
    }
}

module.exports = verifyGoogleToken
