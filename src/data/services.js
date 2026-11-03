// Short service list used by the home page, services page and footer cards.
import epoxyImg from "../assets/services/epoxy.jpg";
import polishingImg from "../assets/services/polishing.jpg";
import stampingImg from "../assets/services/stamping.jpg";
import terrazzoImg from "../assets/services/terrazzo.jpg";
import waterproofingImg from "../assets/services/waterproofing.jpg";
import grindingImg from "../assets/services/grinding.jpg";

export const SERVICES = [
  {
    slug: "epoxy-flooring",
    title: "Epoxy flooring",
    text: "Seamless, chemical-resistant floors for factories, warehouses and clean rooms.",
    image: epoxyImg,
  },
  {
    slug: "concrete-polishing",
    title: "Concrete polishing",
    text: "Ground and polished concrete with a satin or high-gloss finish that lasts.",
    image: polishingImg,
  },
  {
    slug: "concrete-stamping",
    title: "Concrete stamping",
    text: "Patterned driveways, walkways and patios that look like stone, brick or slate.",
    image: stampingImg,
  },
  {
    slug: "terrazzo-flooring",
    title: "Terrazzo flooring",
    text: "Aggregate-rich terrazzo for lobbies, stairs and busy public spaces.",
    image: terrazzoImg,
  },
  {
    slug: "waterproofing",
    title: "Waterproofing",
    text: "Membranes and coatings that keep water out of roofs, basements and tanks.",
    image: waterproofingImg,
  },
  {
    slug: "surface-preparation",
    title: "Grinding & surface preparation",
    text: "Grinding, crack repair and levelling so new coatings bond and stay down.",
    image: grindingImg,
  },
];

export const PROCESS = [
  {
    title: "Site inspection",
    text: "We visit, measure the area and test the existing concrete for moisture and damage.",
  },
  {
    title: "Surface preparation",
    text: "The slab is ground, cracks and holes are repaired, and dust is removed.",
  },
  {
    title: "Installation",
    text: "Our team applies the chosen system in the right number of coats and curing times.",
  },
  {
    title: "Inspection & handover",
    text: "We check the finish with you, hand over care instructions and sign off the job.",
  },
];
