const  express = require("express");
const { uuid, isUuid } = require("uuidv4");
const app = express();
const projectsContainer = [];

app.use(express.json());

function logRequest(request, response, next){
    const { method, url } = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    next();
}

function validateProjectId(req, res, next){
    const { id } = req.params;

    if(!isUuid(id)){
        return res.status(400).json({
            message: "Invalid project ID."
        });
    }

   return next();
}

app.use(logRequest);

app.get("/projects", (req, res)=>{

    const { title } = req.query;
    const results = title ? 
    projectsContainer.filter(project=>{
        project.title.includes(title)
    }) : projectsContainer;

    return res.json(results);
});

app.post("/projects", (req, res)=>{

    const {title, madeBy} = req.body;
    const project = { id:uuid(), title, madeBy };

    projectsContainer.push(project);

    return res.json([project]);
});

app.put("/projects/:id", validateProjectId, (req, res)=>{

    const { id } = req.params;
    const {title, madeBy} = req.body;
    const projectIndex = projectsContainer.findIndex(project=> project.id ===id );

    if( projectIndex < 0){
        return res.status(400).json({
            error: " project not found.!"
        });
    }

    const project = { id, title, madeBy};
    projectsContainer[projectIndex] = project;

    return res.json([project]);
});

app.delete("/projects/:id", validateProjectId, (req, res)=>{

    const { id } = req.params;
    const projectIndex = projectsContainer.findIndex(project=> project.id ===id );

    if( projectIndex < 0){
        return res.status(400).json({
            error: " project not found.!"
        });
    }

    projectsContainer.splice(projectIndex, 1);

    return res.status(204).send();
});

app.listen(3000, ()=>{
    console.log("Server is running...!");
});