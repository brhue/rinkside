const express = require("express");
const axios = require("axios");
const qs = require("querystring");

const app = express();

const PORT = process.env.PORT || 8080;

const apiUrl = "https://api.nhle.com/stats/rest/en/leaders/";

app.get("/api/leaders/:position/:metric", async (req, res) => {
  const url = `${apiUrl}${req.params.position}/${req.params.metric}?${qs.stringify(req.query)}`;
  try {
    const resp = await axios.get(url);
    res.json(resp.data);
  } catch (err) {
    res.json({
      error: true,
      message: err,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
