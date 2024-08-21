import https from "https";
import express from "express";
import { json } from "stream/consumers";
import { getAllUsers, createUser } from "./controller/user.controller.js";
import connectDB from "./database/db.js";
import cors from "cors"; // Import cors

import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN; // messaging API token

app.use(express.json());
app.use(cors()); // Use cors as middleware
app.use(
  express.urlencoded({
    extended: true
  })
);

// app.get("/", (req, res) => {
//   return res.status(200).json({ message: "Line webhook is working!" });
// });

app.post("/webhook", function (req, res) {
  try {
    res.send("HTTP POST request sent to the webhook URL!");
    if (req.body && req.body.events[0].type === "message") {
      const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: "text",
            text: req.body.events[0].message.text
          }
        ]
      });

      console.log(JSON.stringify(req.body.events[0], null, 2));

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN
      };

      const webhookOptions = {
        hostname: "api.line.me",
        path: "/v2/bot/message/reply",
        method: "POST",
        headers: headers
      };

      const request = https.request(webhookOptions);

      request.on("error", (err) => {
        console.error(err);
      });

      request.write(dataString);
      request.end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.get("/getProfile", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");

  if (req.body && req.body.events[0].type === "message") {
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",

          text: req.body.events[0].message.text
        }
      ]
    });

    console.log(req.body.events[0]);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN
    };

    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers
    };

    const request = https.request(webhookOptions);

    request.on("error", (err) => {
      console.error(err);
    });

    request.write(dataString);
    request.end();
  }
});

app.get("/user/getAll", async function (req, res) {
  try {
    const data = await getAllUsers(req, res); // Remove res from the arguments
    return data;
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/user/create-user", async function (req, res) {
  try {
    const data = await createUser(req, res);
    return data;
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/sendLine", async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    const data = req.body;
    const url = "https://api.line.me/v2/bot/message/push";
    console.log("data >>>>>>>>>", data);

    if (authHeader) {
      try {
        const token = authHeader.slice(7);
        await axios.post(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + token
          }
        });
        return res.status(200).json({ message: "success" });
      } catch (error) {
        console.error(`Error in sendPost: ${error}`);
        return res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/getTotalSend", async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    const url = "https://api.line.me/v2/bot/message/quota/consumption";

    if (authHeader) {
      try {
        const token = authHeader.slice(7);
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + token
          }
        });
        console.log(response.data.totalUsage)
        const limit = await getLimit(req);

        return res
          .status(200)
          .json({
            message: "success",
            limit: limit,
            total: response.data.totalUsage
          });
      } catch (error) {
        console.error(`Error in sendPost: ${error}`);
        return res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getLimit(req) {
  try {
    const authHeader = req.headers.authorization;
    const url = "https://api.line.me/v2/bot/message/quota";

    if (authHeader) {
      try {
        const token = authHeader.slice(7);
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + token
          }
        });
        return response.data.value
      } catch (error) {
        console.error(`Error in sendPost: ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error in sendPost: ${error}`);
  }
}


const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log(`line app listening at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
