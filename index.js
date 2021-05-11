let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const express = require("express");
const morgan = require("morgan");

const requestLogger = require("./middlewares/requestLogger");

const app = express();

app.use(express.json());
app.use(morgan(requestLogger));

const generateId = () => Math.round(Math.random() * 100000);

app.get("/api/persons", (request, response) => {
  response.status(200).json(persons);
});

app.get("/api/info", (request, response) => {
  response.send(
    `<p>Phone has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) response.status(200).json(person);
  else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing :(",
    });
  }

  existPerson = persons.find((person) => person.name === body.name);
  if (existPerson)
    return response.status(400).json({ error: "name must be unique" });

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(persons);
});

const unknownEndpoint = (request, response) =>
  response.status(404).send({ error: "unknown endpoint" });
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
