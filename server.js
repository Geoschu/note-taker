const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Require the uuid package
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Set up the GET /notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Create API routes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate a unique ID for the new note

  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes" });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(notes),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to save note" });
        }
        res.json(newNote);
      }
    );
  });
});

// DELETE route to delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes" });
    }
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(notes),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to delete note" });
        }
        res.json({ message: "Note deleted successfully" });
      }
    );
  });
});

// Set up the GET * route to serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
