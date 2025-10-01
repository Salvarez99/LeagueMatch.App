const functions = require("firebase-functions");
const {addUser} = require("../services/userService");

exports.addUserEndpoint = functions.https.onRequest( 
    async (req, res) => {
        try{
            const userDTO = req.body;
            const createdUser = await addUser(userDTO);
            res.status(200).json({
                success : true, 
                data : createdUser
            });
        }catch(err){
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
);