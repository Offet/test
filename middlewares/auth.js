//  this section will be for the authentication of the user
import jwt from "jsonwebtoken";
import { User } from "../models/user_model.js";
import { roles } from "../config/roles.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        // Check if session has user
        if (req.session.user) {
            // Check if user exist in database
            const user = await User.findById(req.session.user.id);
            if (!user) {
                return res.status(401).json('User Does Not Exist!');
            }
            // Call next function
            next();
        } else if (req.headers.authorization) {
            try {
                // Extract token from headers
                const token = req.headers.authorization.split(' ')[1];
                // Verify the token to get user and append to request
                req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
                // Check if user exist in database
                const user = await User.findById(req.user.id);
                if (!user) {
                    return res.status(401).json('User Does Not Exist!');
                }
                // Call next function
                next();
            } catch (error) {
                res.status(401).json(error);
            }
        } else {
            res.status(401).json('Not Authenticated!');
        }
    } catch (error) {
        next(error);
    }
}


//  check if user has permission available
export const hasPermission = (permission) => {
    return async (req, res, next) => {
        try {
            // Get user id from session or request
            const id = req.session?.user?.id || req?.user?.id;
            // Find user by id
            const user = await User.findById(id);
            // Find user role with permissions
            const userRole = roles.find(element => element.role === user.role);
            // Use role to check if user has permission
            if (userRole && userRole.permissions.includes(permission)) {
                next();
            } else {
                res.status(403).json('Not Authorized!');
            }
        } catch (error) {
            next(error);
        }
    }
};