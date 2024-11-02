import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

const createTokenAndSaveCookies = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { // jwt generated based on userId and SSL key
        expiresIn: "15d"
    })
    res.cookie("jwt", token, {
        httpOnly: true, // saves from attacks
        secure: true,
        sameSite: "strict"
    })
    await User.findByIdAndUpdate(userId, { token }); // jwt is saved to database.
    return token;
}

export default createTokenAndSaveCookies;