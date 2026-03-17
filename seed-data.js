const mongoose = require("mongoose");

const planets = [
  {
    id: 1,
    name: "Mercury",
    description: "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
    image: "images/mercury.png",
    velocity: "47.87 km/s",
    distance: "57.9 million km"
  },
  {
    id: 2,
    name: "Venus",
    description: "Venus is the second planet from the Sun and is known for its thick, hot atmosphere.",
    image: "images/venus.png",
    velocity: "35.02 km/s",
    distance: "108.2 million km"
  },
  {
    id: 3,
    name: "Earth",
    description: "Earth is the third planet from the Sun and the only known world to support life.",
    image: "images/earth.png",
    velocity: "29.78 km/s",
    distance: "149.6 million km"
  },
  {
    id: 4,
    name: "Mars",
    description: "Mars is the fourth planet from the Sun and is often called the Red Planet.",
    image: "images/mars.png",
    velocity: "24.07 km/s",
    distance: "227.9 million km"
  },
  {
    id: 5,
    name: "Jupiter",
    description: "Jupiter is the largest planet in the Solar System and a gas giant.",
    image: "images/jupiter.png",
    velocity: "13.07 km/s",
    distance: "778.5 million km"
  },
  {
    id: 6,
    name: "Saturn",
    description: "Saturn is famous for its bright ring system and is the sixth planet from the Sun.",
    image: "images/saturn.png",
    velocity: "9.69 km/s",
    distance: "1.43 billion km"
  },
  {
    id: 7,
    name: "Uranus",
    description: "Uranus is an ice giant that rotates on its side relative to its orbit.",
    image: "images/uranus.png",
    velocity: "6.81 km/s",
    distance: "2.87 billion km"
  },
  {
    id: 8,
    name: "Neptune",
    description: "Neptune is the farthest known planet from the Sun and has strong supersonic winds.",
    image: "images/neptune.png",
    velocity: "5.43 km/s",
    distance: "4.5 billion km"
  }
];

const planetSchema = new mongoose.Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const Planet = mongoose.model("planets", planetSchema);

async function seed() {
  const rawUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/solar-system";
  const uri = rawUri.trim();

  if (rawUri !== uri) {
    console.warn("MONGO_URI contained leading or trailing whitespace and was trimmed.");
  }

  if (uri.includes("<db_password>")) {
    throw new Error("MONGO_URI still contains the Atlas placeholder <db_password>.");
  }

  if (uri.includes('"')) {
    throw new Error("MONGO_URI contains quote characters. Export the raw URI without wrapping quotes inside the value.");
  }

  console.log(`Using MONGO_URI: ${JSON.stringify(uri)}`);

  await mongoose.connect(uri, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Planet.deleteMany({});
  await Planet.insertMany(planets);

  console.log(`Seeded ${planets.length} planets into ${uri}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
