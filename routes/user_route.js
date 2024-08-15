import { Router } from "express";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";
import { createUser, deleteUser, getUsers, logout, profile, register, login, updateUser } from "../controllers/user_cont.js";

// Create router
const userRouter = Router();

// Define routes
userRouter.post('/users/register', register);

// userRouter.post('/users/login', login);

userRouter.post('/users/auth/login', login);

userRouter.get('/users/profile', isAuthenticated, profile);

userRouter.post('/users/logout', logout);

userRouter.get('/users', isAuthenticated, hasPermission('read_users'), getUsers);

userRouter.post('/users', isAuthenticated, hasPermission('create_user'), createUser);

userRouter.patch('/users/:id', isAuthenticated, hasPermission('update_user'), updateUser);

userRouter.delete('/users/:id', isAuthenticated, hasPermission('delete_user'), deleteUser);

// Export router
export default userRouter;