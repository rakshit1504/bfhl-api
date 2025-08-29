import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const FULL_NAME = process.env.FULL_NAME || "john_doe";
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "17091999";
const EMAIL = process.env.EMAIL || "john@xyz.com";
const ROLL = process.env.ROLL_NUMBER || "ABCD123";

const userId = `${FULL_NAME.toLowerCase()}_${DOB_DDMMYYYY}`;

const isDigits = s => /^[+-]?\d+$/.test(s);
const isAlpha = s => /^[A-Za-z]+$/.test(s);
const toAltCaps = arr => {
  let out = "";
  for (let i = 0; i < arr.length; i++) out += i % 2 === 0 ? arr[i].toUpperCase() : arr[i].toLowerCase();
  return out;
};

app.get("/", (req, res) => res.status(200).json({ status: "ok", route: "/bfhl" }));

app.post("/bfhl", (req, res) => {
  try {
    const body = req.body || {};
    const data = Array.isArray(body.data) ? body.data : null;
    if (!data) return res.status(400).json({ is_success: false, error: "invalid_payload" });

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    const letterStream = [];

    for (const raw of data) {
      const s = String(raw);
      if (isDigits(s)) {
        const n = parseInt(s, 10);
        if (Math.abs(n) % 2 === 0) even_numbers.push(s);
        else odd_numbers.push(s);
        sum += n;
      } else if (isAlpha(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }
      for (const c of s) if (/[A-Za-z]/.test(c)) letterStream.push(c);
    }

    const concat_string = toAltCaps(letterStream.reverse());

    return res.status(200).json({
      is_success: true,
      user_id: userId,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    return res.status(500).json({ is_success: false, error: "server_error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port);
