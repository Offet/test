import {model, Schema, Types} from "mongoose";
import {toJSON} from "@reis/mongoose-to-json";



const contentSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true   
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'audio', 'video'], // Example enum values
    required: true
  },
  contentData: {
    type: Object, // Can store text, file paths, or other data depending on contentType
    required: true
  },
  metadata: {
    type: Object // Optional for additional metadata
  },
  referenceCount: {
    type: Number,
    default: 0
  }
}, {
    timestamps: true
});


//  use plugins for the ids
contentSchema.plugin(toJSON);

export const Content = model('Content', contentSchema);
