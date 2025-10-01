const db = require("../firebaseConfig").db;
const UserDTO = require("../models/UserDTO");

async function addUser(userData){
    const user = new UserDTO(userData);
    await db.collection("users").add({...user});
    return user;
}

module.exports = { addUser };