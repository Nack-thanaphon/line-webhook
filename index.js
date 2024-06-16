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

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Line webhook is working!" });
});

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
    const data = {
      to: "U1fb08bc0ba902ecfbafc313b9092ede6",
      messages: [
        {
          type: "flex",
          altText: "BOT : Server Status",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              url: "https://media.jobthai.com/v1/images/logo-pic-map/206659_logo_20220304152555.jpeg",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
              action: {
                type: "uri",
                label: "Action",
                uri: "https://linecorp.com/"
              }
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "md",
              contents: [
                {
                  type: "text",
                  text: "สวัสดีคุณ ",
                  contents: []
                },
                {
                  type: "text",
                  text: "Server Status",
                  weight: "bold",
                  size: "xl",
                  gravity: "center",
                  wrap: true,
                  contents: []
                },
                {
                  type: "box",
                  layout: "baseline",
                  margin: "md",
                  contents: [
                    {
                      type: "icon",
                      url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                      size: "sm"
                    },
                    {
                      type: "icon",
                      url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                      size: "sm"
                    },
                    {
                      type: "icon",
                      url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                      size: "sm"
                    },
                    {
                      type: "icon",
                      url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                      size: "sm"
                    },
                    {
                      type: "icon",
                      url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
                      size: "sm"
                    },
                    {
                      type: "text",
                      text: "4.0",
                      size: "sm",
                      color: "#999999",
                      flex: 0,
                      margin: "md",
                      contents: []
                    }
                  ]
                },
                {
                  type: "box",
                  layout: "vertical",
                  spacing: "sm",
                  margin: "lg",
                  contents: [
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "Date",
                          size: "sm",
                          color: "#AAAAAA",
                          flex: 1,
                          contents: []
                        },
                        {
                          type: "text",
                          text: "Monday 25, 9:00PM",
                          size: "sm",
                          color: "#666666",
                          flex: 4,
                          wrap: true,
                          contents: []
                        }
                      ]
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "Server Status #1",
                          size: "sm",
                          color: "#AAAAAA",
                          flex: 1,
                          wrap: false,
                          contents: []
                        },
                        {
                          type: "text",
                          text: "กำลังใช้งาน",
                          size: "sm",
                          color: "#04A223FF",
                          flex: 1,
                          wrap: true,
                          contents: []
                        }
                      ]
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "Server Status #2",
                          size: "sm",
                          color: "#AAAAAA",
                          flex: 1,
                          wrap: false,
                          contents: []
                        },
                        {
                          type: "text",
                          text: "ใช้งานไม่ได้",
                          size: "sm",
                          color: "#DA0202FF",
                          flex: 1,
                          wrap: true,
                          contents: []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    };
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
