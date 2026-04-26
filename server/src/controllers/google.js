import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const userData = {
      name: payload.name,
      email: payload.email,
      profilePic: payload.picture,
    };

    // 👉 here you can:
    // - save to DB
    // - check if user exists
    // - create new user

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: "Google auth failed" });
  }
});