import type { Shoe, Review, HeroSlide } from "../types";

export const SHOES: Shoe[] = [
  {
    id: 1,
    name: "STRIDER X",
    tagline: "Born for the streets. Built to last.",
    price: "$189",
    oldPrice: "$249",
    badge: "NEW DROP",
    color: "#FF4D00",
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 11],
    specs: ["Foam React 3.0", "Carbon Plate", "Mesh Upper"],
  },
  {
    id: 2,
    name: "PHANTOM AIR",
    tagline: "Zero gravity. Maximum speed.",
    price: "$219",
    oldPrice: "$299",
    badge: "BESTSELLER",
    color: "#7C3AED",
    sizes: [6, 7, 8, 9, 10, 11, 12],
    specs: ["Air Cushion XR", "Knit Flyweave", "Boost Return"],
  },
  {
    id: 3,
    name: "NOVA RUNNER",
    tagline: "Every mile, rewritten.",
    price: "$159",
    oldPrice: "$209",
    badge: "LIMITED",
    color: "#0EA5E9",
    sizes: [6.5, 7, 7.5, 8, 8.5, 9, 10],
    specs: ["Gel Cushion Pro", "Ripstop Upper", "Torsion Bar"],
  },
  {
    id: 4,
    name: "APEX FORCE",
    tagline: "Grip the earth. Own the city.",
    price: "$239",
    oldPrice: "$319",
    badge: "COLLAB",
    color: "#10B981",
    sizes: [7, 8, 8.5, 9, 9.5, 10, 11, 12],
    specs: ["Terragrip Sole", "Kevlar Weave", "Heel Lock"],
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    shoe: SHOES[0],
    headline: ["RULE THE", "STREETS"],
    sub: "Strider X drops with Foam React 3.0 — the cushion that never quits.",
  },
  {
    id: 2,
    shoe: SHOES[1],
    headline: ["FEEL THE", "PHANTOM"],
    sub: "Air Cushion XR makes every landing feel like the first.",
  },
  {
    id: 3,
    shoe: SHOES[2],
    headline: ["RUN YOUR", "STORY"],
    sub: "Nova Runner. Lightweight enough to forget. Fast enough to remember.",
  },
  {
    id: 4,
    shoe: SHOES[3],
    headline: ["APEX OR", "NOTHING"],
    sub: "Terragrip sole. Built for every surface you dare to conquer.",
  },
];

export const REVIEWS: Review[] = [
  {
    name: "Marcus T.",
    rating: 5,
    text: "Wore these for a half marathon. My PR dropped by 4 minutes.",
    tag: "Runner",
  },
  {
    name: "Aisha K.",
    rating: 5,
    text: "The colorways are insane. Got stopped twice in the first hour.",
    tag: "Sneakerhead",
  },
  {
    name: "Luca D.",
    rating: 5,
    text: "Best investment I made this year. Period.",
    tag: "Trainer",
  },
];
