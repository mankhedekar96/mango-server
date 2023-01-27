const express = require("express");
const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
const twilio = require("twilio");
// const redis = require("redis");
const config = require("./config");

const app = express();
app.use(bodyParser.json());

// Twilio account SID and auth token
const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

// Redis client
// const redisClient = redis.createClient();

// Nodemailer transport
// const transport = nodemailer.createTransport({
//   service: config.email.service,
//   auth: {
//     user: config.email.auth.user,
//     pass: config.email.auth.pass,
//   },
// });

app.post("/generate_otp", async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;

    // // Generate OTP
    // const otp = Math.floor(Math.random() * 1000000);

    // Send OTP via SMS
    const smsOTPResponse = await client.verify.v2
      .services(config.twilio.serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    console.log(
      "OTP Sent successfully to mobile!",
      JSON.stringify(smsOTPResponse)
    );

    // // Send OTP via email
    // const mailOptions = {
    //   from: "YOUR_EMAIL_ADDRESS",
    //   to: email,
    //   subject: "OTP",
    //   text: `Your OTP is ${otp}`,
    // };

    // await transport.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //   }
    // });

    // // Create an expiration time for the OTP (e.g. 10 minutes)
    // const expiration = Math.floor(Date.now() / 1000) + 600;

    // // Store the OTP in Redis, associated with the user's phone number or email address
    // await redisClient.connect()
    // redisClient.set(phoneNumber, otp, "EX", expiration);

    res.json({ message: "OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/verify_otp", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    } else if (phoneNumber.length < 10) {
      res.status(400).json({ message: "Invalid phone number" });
    } else {
      await client.verify.v2
        .services(config.twilio.serviceSid)
        .verificationChecks.create({ to: phoneNumber, code: otp })
        .then((verification_check) => {
          console.log("OTP Veified ", verification_check);
          const { status, valid } = verification_check;
          res.status(200).json({ status, valid });
        })
        .catch(() => {
          res.status(400).json({ status: 'invalid', valid: false, message: "Invalid OTP" });
        });

      // // Look up the OTP in Redis using the phone number or email address as the key
      // redisClient.get(phoneNumber, (err, storedOtp) => {
      //   if (err) {
      //     console.error(err);
      //     res.status(500).json({ message: "Internal server error" });
      //   } else if (!storedOtp) {
      //     res.status(400).json({ message: "Invalid phone number or email" });
      //   } else if (storedOtp !== otp) {
      //     res.status(400).json({ message: "Invalid OTP" });
      //   } else {
      //     redisClient.del(phoneNumber);
      //     res.json({ message: "OTP verified" });
      //   }
      // });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", () => {
  console.log("Server is listening!");
});

app.get("/generate_otp", (req, res) => {
  console.log("Server is listening!");
  res.status(200).send({ message: "GET IS WORKING!" });
});

app.listen(config.port, () => {
  console.log("Server is started!");
});
