const express = require("express");
const morgan = require("morgan");

const cors = require("cors");

const app = express();

app.use(cors());

morgan.token("response-data", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return " ";
});

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :response-data",
  ),
);

const PORT = process.env.PORT || 3001;

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

function generateNewId() {
  const min = persons.length + 1;
  const max = 1000;
  return Math.floor(Math.random() * (max - min) + min);
}

app.get("/api/persons", (req, res) => {
  return res.status(200).json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res
      .status(404)
      .json({ error: `unable to find person of id: ${id}` });
  }
  return res.status(200).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res
      .status(404)
      .json({ error: `unable to find person of id: ${id}` });
  }
  persons = persons.filter((person) => person.id !== id);

  return res.status(200).json(person);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: "name missing" });
  }

  if (!body.number) {
    return res.status(400).json({ error: "number missing" });
  }

  const isPerson = persons.find((p) => p.name === body.name);
  if (isPerson) {
    return res
      .status(400)
      .json({ error: `${isPerson.name} is already in phonebook` });
  }

  const newPerson = {
    id: String(generateNewId()),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(newPerson);

  return res.status(201).json(newPerson);
});

app.get("/info", (req, res) => {
  const personsCount = persons.length;
  const currentTime = new Date().toString();
  return res.send(
    `<p>Phonebook has info for ${personsCount} people!</p><p>${currentTime}</p>`,
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
