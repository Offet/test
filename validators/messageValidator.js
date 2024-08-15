import { body, validationResult } from 'express-validator';

// Middleware for validating the message form data
export const validateMessage = [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('duration').notEmpty().withMessage('Duration is required').isISO8601().withMessage('Invalid date format'),
  body('recipient').notEmpty().withMessage('Recipient email is required').isEmail().withMessage('Invalid email address'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// export default validateMessage;
