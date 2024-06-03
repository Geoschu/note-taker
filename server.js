const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
//set up the GET /notes route
app.get("/notes", (req, res) => {
  res.send("Notes Page");
});

// set up the GET * route to serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.use(express.static("public"));

// create API routes
const fs = require("fs");
const path = require("path");

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(notes),
      (err) => {
        if (err) throw err;
        res.json(newNote);
      }
    );
  });
});
