const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function checkIfProjectAlreadyExistsInRepository(req, res, next){
  const { url } = req.body

  const checkExistingProject = repositories.findIndex(
    (currentProject) => currentProject.url === url
  );

  if (checkExistingProject >= 0) {
    return res.json({ error: 'Project already exists' });
  }

  return next()
}

function checkIfProjectExists(req, res, next){
  const { id } = req.params

  const checkExistingProject = repositories.findIndex(
    (currentProject) => currentProject.id === id
  );

  console.log(checkExistingProject)

  if (checkExistingProject < 0) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  console.log(repositories)

  return response.json(repositories)
});

app.post("/repositories",  (request, response) => {
  const { title, url, techs } = request.body;

  const actualProject = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(actualProject)

  return response.json(actualProject)
})


app.put("/repositories/:id", checkIfProjectExists, (request, response) => {
  const { id } = request.params
  const { title, url, techs, likes } = request.body

  const repositoryIndex = repositories.findIndex(project => project.id === id)

  // if (likes){
  //   return response.status(400).json({error: "cannot update likes manually"})
  // }

  repositories[repositoryIndex].title = title
  repositories[repositoryIndex].url = url
  repositories[repositoryIndex].techs = techs


  return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", checkIfProjectExists, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(project => project.id === id)

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfProjectExists, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(project => project.id === id)

  const actualLikes = repositories[repositoryIndex].likes

  repositories[repositoryIndex].likes = actualLikes + 1

  return response.json(repositories[repositoryIndex])
});

module.exports = app;
