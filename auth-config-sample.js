// Don't commit this file to your public repos
exports.config = {
    password: "password",
    passphrase: "passphrase",
    admin: {
        username: "username",
        password: "password"
    },
    clients: [
        {
            name: "name",
            id: "0123456789",
            expire: new Date(1970,01,01)
        }
    ]
}