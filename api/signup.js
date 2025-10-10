import { createClient } from "@libsql/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { first_name, last_name, email, phone, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    await db.execute({
      sql: `INSERT INTO users (first_name, last_name, email, phone, password)
            VALUES (?, ?, ?, ?, ?)`,
      args: [first_name, last_name, email, phone, password],
    });

    res.status(200).json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
}
