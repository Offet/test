import { User } from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUserValidator,
  registerValidator,
  updateUserValidator
} from "../validators/user.js";

// User registration
export const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidator.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, password } = value;

    // Check if user exists
    const userExistence = await User.findOne({ email });
    if (userExistence) {
      return res.status(401).send("User already exists!");
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      value.password = hashedPassword;

      // Create a new user
      const newUser = await User.create(value);
      req.session.user = { id: newUser._id };

      return res.status(201).json({ message: "Registration Successful!" });
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// User login
export const login = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });

    if (!user) {
      return res.status(401).json("User does not exist");
    }

    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass) {
      return res.status(401).json("Invalid login details");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "72h" }
    );

    res.status(200).json({
      message: 'User logged in', 
      accessToken: token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        otherNames: user.otherNames,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};

// User logout
export const logout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.status(200).json("Logout successful!");
  } catch (error) {
    next(error);
  }
};

// Create user
export const createUser = async (req, res, next) => {
  try {
    const { value, error } = createUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }

    const hashedPassword = bcrypt.hashSync(value.password, 10);
    await User.create({
      ...value,
      password: hashedPassword,
    });

    res.status(201).json("User Created");
  } catch (error) {
    next(error);
  }
};

// User profile
export const profile = async (req, res, next) => {
  try {
    const id = req.session?.user?.id || req?.user?.id;
    const user = await User.findById(id).select({ password: false });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const email = req.query.email?.toLowerCase();
    const userName = req.query.userName?.toLowerCase();
    const filter = {};

    if (email) {
      filter.email = email;
    }
    if (userName) {
      filter.userName = userName;
    }

    const users = await User.find(filter);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// Get a specific user
export const getUser = async (req, res, next) => {
  try {
    const userName = req.params.userName.toLowerCase();
    const userDetails = await User.findOne({ userName })
      .select("-password");

    if (!userDetails) {
      return res.status(404).json(userDetails);
    }

    return res.status(200).json({ userDetails });
  } catch (error) {
    next(error);
  }
};

// Update user details
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { error, value } = updateUserValidator.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    if (value.password) {
      value.password = await bcrypt.hash(value.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, value, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json("User updated successfully");
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};
