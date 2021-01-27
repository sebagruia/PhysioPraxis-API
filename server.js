const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const contentful = require("contentful");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

const client = contentful.createClient({
  environment: "master",
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCES_TOKEN,
});

app.get("/contentful/homeContent", async (req, res) => {
  const homeContent = await client.getEntry("6qEtbqFKX5CXcj6jPTg4VR");
  res.send(homeContent);
});

app.get("/contentful/testimonials", async (req, res) => {
  const testimonialsHome = await client.getEntries({
    content_type: "testimonial",
  });
  res.send(testimonialsHome);
});

app.get("/contentful/aboutUs", async (req, res) => {
  const aboutUs = await client.getEntry("6HiiszYhxuNF18wxss5Ijd");
  res.send(aboutUs);
});

app.get("/contentful/services", async (req, res) => {
  const services = await client.getEntries({ content_type: "services" });
  res.send(services);
});

app.get("/contentful/posts", async (req, res) => {
  const posts = await client.getEntries({ content_type: "post" });
  res.send(posts);
});

app.post("/booking", async (req, res) => {
  console.log(req.body);
  const data = {
    service_id: process.env.EMAILJS_YOUR_SERVICE_ID,
    template_id: req.body.date
      ? process.env.EMAILJS_YOUR_TEMPLATE_ID
      : process.env.EMAILJS_YOUR_NEW_MESSAGE_TEMPLATE,
    template_params: req.body,
    user_id: process.env.EMAILJS_YOUR_USER_ID,
  };
  try {
    const fetchResponse = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        contentType: "application/json",
      }
    );

    res.sendStatus(fetchResponse.status);
  } catch (error) {
    res.send(error);
  }
});

app.get("/", (req, res) => {
  res.send("Merge Serverul");
});

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log("Server running on port" + port);
});
