import Joi from 'joi';

const timeCapsuleSchema = Joi.object({
  title: Joi.string().required().min(3).max(50),
  description: Joi.string().allow(''), // Allow empty description
  content: Joi.string(),
  scheduledDeliveryTime: Joi.date().required(),
  recipients: Joi.array().items(Joi.string()).required(),
});

export default timeCapsuleSchema;

//  time capsule validator may have an issue
