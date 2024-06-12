const https = require("https");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = "e1l7kAgUdMdDoCmJs3xyDu0R1yXIGedLufWKFYcAGQjgERyrPzImX6w14qLAXKWC/ZHsPuaRNR84k4V03tn0ZakqxVCLdTwChapiTEn1NnnW1nfvqhDlx0KFHMk8wRUXuFoeFZy5NlcnTpEKGT3hdAdB04t89/1O/w1cDnyilFU=";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");

  if (req.body && req.body.events[0].type === "message") {
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
         
          text: req.body.events[0].message.text,
        },
      ],
    });


    console.log(req.body.events[0])
    console.log('helllo world')
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    };

    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
    };

    const request = https.request(webhookOptions);

    request.on("error", (err) => {
      console.error(err);
    });

    request.write(dataString);
    request.end();
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
