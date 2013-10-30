var initiatives = {
    name: "Lumière",
    contact: {
        name: "Ajith",
        address: {
            pin: "560032",
            city: "Bangalore",
            neighbourghood: "RT Nagar",
            street: "#522, 4th Cross, 2nd Block"
        },
        phone: [
            {
                label: "phone 1",
                number: "919845532921"
            },
            {
                label: "phone 2",
                number: "91802363921"
            }
        ],
        email: [
            {
                label: "email 1",
                address: "olivia.godeluck@gmail.com"
            }
        ],
        website: "www.lumiere.com"
    }
    geocode: [latitude: 13.021751, longitude: 77.594319],
    sector: "food",
    tags: ["distributor of organic food"],
    description: "Organic restaurant",
    meta: {
        favorite: true,
        published: false
    },
    legalStatus: "Private Limited"
}

var InitiativesSchema = new Schema({
    name: { type: String, unique: true },
    contact.name: { type: String },
    contact: {
        address: {
            pin: { type: String},
            city: { type: String},
            neighbourghood: { type: String },
            street: { type: String }
        },
        phone: [
            {
                label: { type: String},
                number: { type: String }
            }
        ],
        email: [
            {
                label: { type: String },
                addresse: { type: String }
            }
        ],
        website: { type: String }
    },
    geocode: { 
        latitude: { type: Number, min: -180, max: 180},
        longitude: { type: Number, min: -180, max: 180},
        index: '2dsphere'
    },
    sector: { type: String},
    legalStatus: { type: String },
    tags: { type: [String]},
    description: { type: String },
    meta: {
        favorite: { type: Boolean },
        published: { type: Boolean },
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now}
    }
});

db.initiatives.ensureIndex( { "geocode": "2dsphere" })
db.runCommand({ geoNear: "initiatives", near: { type: "Point", coordinates: [14.9,75.7] }, spherical: true }) // recherche les points les plus proches
db.initiatives.find({ gps: { $near: { $geometry: { type: "Point", coordinates: [14.9, 75.7] } }, $maxDistance: 10000 } }) // recherche les points à moins de 10000m
db.initiatives.find({ sector: "food" }) // recherche toutes les initiatives du secteur "food"
// recherche toutes les initiatives avec le mot-clef "monde"
db.initiatives.ensureIndex({ keywords: "text", description: "text" }) ou db.initiatives.ensureIndex({ "$**": "text" }, { name: "TextIndex" })
db.initiatives.runCommand( "text", { search: "monde" })