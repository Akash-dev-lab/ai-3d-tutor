const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const narrations = {
    0: "Hi there! I'm here to show you how a 'JWT' works. Think of it like a digital wristband for an exclusive club. Let's see how you get one!",
    1: "First, our little blue user needs to prove who they are. They walk up to the Auth Server (the green building) and say 'Hey, it's me!' (usually with a password).",
    2: "The server checks their ID. If it recognizes them, it prints a special card called a JWT. This card says 'I trust this person' and is signed by the server.",
    3: "Now the user has their JWT card (that glowing purple thing). They don't need to say their password again; they just show this card to the gate.",
    4: "The gate checks the card's signature. It looks authentic! The gate opens up automatically, and our user can breeze right through. Simple and secure!"
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
