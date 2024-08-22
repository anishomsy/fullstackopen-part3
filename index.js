const express = require("express");
const app = express();
const PORT = 3001;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("hello, world");
});

app.get("/api/persons", (req, res) => {
  return res.status(200).json(persons);
});

app.get("/info", (req, res) => {
  const personsCount = persons.length;
  const currentTime = new Date().toString();
  return res.send(
    `<p>Phonebook has info for ${personsCount} people!</p><p>${currentTime}</p>`,
  );
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
