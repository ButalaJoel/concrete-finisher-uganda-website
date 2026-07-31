import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  service: {
    type: String,
    required: true,
  },

  client: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  industry: {
    type: String,
    required: true,
  },

  surfaceArea: {
    type: String,
  },

  completionTime: {
    type: String,
  },

  system: {
    type: String,
  },

  image: {
    type: String,
  },

  heroImage: {
    type: String,
  },

  shortDescription: {
    type: String,
  },

  overview: {
    type: String,
  },

  challenge: {
    type: String,
  },

  solution: {
    type: String,
  },

  products: [
    {
      name: String,
      purpose: String,
    },
  ],

  gallery: [
    String,
  ],

});

const Project = mongoose.model("Project", projectSchema);

export default Project;