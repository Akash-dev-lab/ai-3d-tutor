const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const narrations = {
    0: "Welcome to the JWT visualizer. JWT stands for JSON Web Token. It is a secure way to share information between a user and a server.",
    1: "The process begins with a login request. The user sends their credentials to the authentication server. This is how the server knows who the user is.",
    2: "The server verifies the credentials. If they are correct, the server creates a JWT. This token contains user data and a digital signature for security.",
    3: "The user receives and stores the token. They can now use this token to access protected areas. They do not need to send their password ever again.",
    4: "When the user reaches a protected gate, they show their token. The gate verifies the digital signature. If the signature is valid, access is granted.",
    5: "Every token has an expiration time. This improves security by limiting how long a token is valid. If a token expires, the user must log in again.",
    6: "A token is invalid if it has been changed or if the signature does not match. The gate rejects modified tokens to keep the system secure.",
    100: "Hi there. Have you ever wondered how websites remember who you are without asking for your password every single second? That’s where the JSON Web Token—or JWT—comes in. Let’s follow a simple journey. First, a user sends their login details to an authentication server. If the details are correct, the server doesn't just open a door; instead, it hands the user a digital key—a JWT. This token is special. It’s a compact, secure package that contains a digital signature proving it hasn't been tampered with. Now, the user carries this token to a security gate. They don't need to re-enter their password; they simply show the token. The gate quickly verifies the signature, and once confirmed, it swings open to grant access. It’s a simple, secure, and efficient way to handle identity across the web. With a JWT, the server doesn't need to remember everything about you—it just needs to trust the token you hold."
};

app.get('/api/narration/:step', (req, res) => {
    const step = parseInt(req.params.step);

    if (narrations.hasOwnProperty(step)) {
        res.json({ step, narration: narrations[step] });
    } else {
        res.status(404).json({ error: "Step not found" });
    }
});

app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const lowerMsg = message ? message.toLowerCase() : '';

    let answer = "I'm not sure about that. Try asking 'What is a JWT?' or 'Is it safe?'.";

    if (lowerMsg.includes('what') && lowerMsg.includes('jwt')) {
        answer = "A JWT (JSON Web Token) is like a digital ID card. It securely transmits information between parties as a JSON object.";
    } else if (lowerMsg.includes('why') || lowerMsg.includes('use')) {
        answer = "We use JWTs because they are compact and self-contained. The server doesn't need to keep a session record in memory.";
    } else if (lowerMsg.includes('safe') || lowerMsg.includes('secure')) {
        answer = "JWTs are signed, so they can't be tampered with. However, you should secure them with HTTPS and never put secrets in the payload!";
    } else if (lowerMsg.includes('header')) {
        answer = "The Header tells us the type of token (JWT) and the hashing algorithm used (like HS256).";
    } else if (lowerMsg.includes('payload')) {
        answer = "The Payload contains the claims (data) about the user, like their ID or name. This part is readable by anyone!";
    } else if (lowerMsg.includes('signature')) {
        answer = "The Signature is what makes the token secure. It's created using a secret key to verify the token hasn't been changed.";
    }

    res.json({ answer });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
