import https from "https";
import express from "express";
import cors from "cors"; // Import cors

import * as dotenv from "dotenv";
import { replyFlex, replyText } from "./service/line.service.js";
import { getProductTemplate } from "./template/product.template.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Use cors as middleware
app.use(
  express.urlencoded({
    extended: true
  })
);

app.get("/", function (req, res) {
  console.log("Hello World!")
  return res.status(200).json({
    status: 200,
    message: "Hello World!"
  });
});
app.post("/webhook", async function (req, res) {
    try {
        if (!req.body?.events?.[0]?.type === "message") {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid webhook event'
            });
        }

        const uid = req.body.events[0].source.userId;
        const messageText = req.body.events[0].message.text;

        const flexMessage = await getProductTemplate(messageText);
        console.log('flexMessage',flexMessage)
        const messageData = flexMessage 
            ? await replyFlex(uid, flexMessage)
            : await replyText(uid, 'ไม่พบข้อมูล');

        return res.status(200).json({
            status: 'success',
            message: 'Message sent successfully',
            data: messageData
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'An error occurred'
        });
    }
});

const startServer = async () => {
  try {
    // connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log(`line app listening at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
