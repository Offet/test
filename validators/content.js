import Joi from 'joi';

export const contentSchema = Joi.object({
  contentType: Joi.string().valid('text', 'image/jpeg', 'audio/mp3', 'video/mp4').required(),
  contentData: Joi.any(), // More specific validation based on contentType required
  metadata: Joi.object().optional(),
  referenceCount: Joi.number().integer().min(0).default(0)
});

