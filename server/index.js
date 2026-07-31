import express from "express";
import cors from "cors";
import quotationRoutes from "./routes/quotationRoutes.js";

import connectDB from "./config/db.js";

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/quotations", quotationRoutes);

const PORT = 5000;

const projects = [
  {
    id: 1,
    title: "Commercial Epoxy Flooring",
    location: "Namanve Industrial Area",
    service: "Epoxy Flooring",
  },
  {
    id: 2,
    title: "Modern Polished Floor",
    location: "Entebbe",
    service: "Concrete Polishing",
  },
  {
    id: 3,
    title: "Roof Waterproofing",
    location: "Kampala",
    service: "Waterproofing",
  },
];

app.get("/", (req, res) => {
  res.send("Concrete Finisher Backend is running.");
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});


app.get("/api/projects/:slug", (req, res) => {

  const { slug } = req.params;

  console.log("Requested slug:", slug);

  console.log(projects);

  const project = projects.find(
    project => project.slug === slug
  );

  if (!project) {
    return res.status(404).json({
      message: "Project not found."
    });
  }

  res.json(project);

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});