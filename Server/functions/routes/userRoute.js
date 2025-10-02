const functions = require("firebase-functions");
const { addUser, updateUser } = require("../services/userService");

// Add User
exports.addUserEndpoint = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") 
      return res.status(405).json({ error: "Method Not Allowed" });

    const userDTO = req.body;
    const createdUser = await addUser(userDTO);

    res.status(200).json({ success: true, data: createdUser });
  } catch (err) {
    console.error("addUser error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});


// Update User
exports.updateUserEndpoint = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") 
      return res.status(405).json({ error: "Method Not Allowed" });

    const user = await updateUser(req.body);

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
