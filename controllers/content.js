import { Content } from "../models/content.js";
import { User } from "../models/user_model.js";
import { contentSchema } from "../validators/content.js";


export const createContent = async (req, res) => {
  try {
 const { contentType } = req.body;

    const { value, error } = contentSchema.validate({
      ...req.body,
      contentData: req.files?.contentData[0].filename
    });

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const userId = req.session?.user?.id || req?.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const contentData = {};

    switch (contentType) {
      case "image":
        contentData.image = req.file.buffer.toString("base64");
        break;
      case "text":
        contentData.text = req.body.text; 
        break;
      case "audio":
        contentData.audio = req.file.buffer.toString("base64");
        break;
      case "video":
        contentData.video = req.file.buffer.toString("base64");
        break;
      default:
        return res.status(400).json({ message: "Invalid contentType" });
    }

    const newContent = await Content.create({
      contentType,
      contentData,
      metadata: req.body.metadata,
      user: userId,
    });

    user.content = newContent._id;
    await user.save();

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating content" });
  }
};

// export const createContent = async (req, res) => {
//   console.log("testing try except");
//   try {
//     const { value, error } =  contentSchema.validate({
//       ...req.body,
//       contentType: req.files?.contentType[0].filename
//     });
//     console.log("value test");

//     if (error) {
//       console.log("error noticed!")
//       return res.status(400).send(error.details[0].message)
//     };
//     console.log("error test");

//     const userId = req.session?.user?.id || req?.user?.id; 
//     console.log("req?");

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send('User not found');
//     }
//       console.log("!user test");

//     // Create or update the user content
//     const content = await Content.findOneAndUpdate(
//       { user: userId }, // Find by user ID
//       value,
//       { new: true, upsert: true } 
//     );
//     console.log("content test");

//     const contentData = {};
//     console.log("empty array test");

//     switch (contentType) {
//       case "image":
//         contentData.image = req.file.buffer.toString("base64");
//         console.log("image test");
//         break;
//       case "text":
//         contentData.text = req.body.text; // Assuming text content is sent in the request body
//         console.log("text test");
//         break;
//       case "audio":
//         contentData.audio = req.file.buffer.toString("base64");
//         console.log("audio test");
//         // Add any audio-specific metadata here, e.g., duration, format
//         break;
//       case "video":
//         contentData.video = req.file.buffer.toString("base64");
//         console.log("video test");
//         // Add any video-specific metadata here, e.g., dimensions, codec
//         break;
//       default:
//         console.log("error getting this");
//         return res.status(400).json({ message: "Invalid contentType" });
//     }

    
//     const newContent = await Content.create({
//       contentType,
//       contentData,
//       metadata,
//     });

//     console.log("create new content test");

//     // Associate the user content with the user
//     user.content = content._id;
//     await user.save();
//     console.log("save content test");

//     res.status(201).json(newContent);
//     console.log("content created");
//   } catch (error) {
//     console.error(error);
//     console.log("not found here");
//     res.status(500).json({ message: "Error creating content" });
//   }
// };



export const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    console.error("Unable to get content");
    res.status(500).json({ message: "Error fetching content" });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { error, value } = contentSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.contentId,
      value,
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).send("Content not found");
    }

    res.status(201).json({ message: "Content work has been updated", updatedContent });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating content" });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.ContentId);

    if (!deletedContent) {
      return res.status(404).send('Content not found');
    }

    // Remove Content from user
    const user = await User.findById(deletedContent.user);
    if (user) {
      user.content = user.Content.filter(contentId => contentId.toString() !== req.params.contentId);
      await user.save();
    }

    res.status(201).json({ content: deletedContent });
  } catch (error) {
    next(error)
    // return res.status(500).send(error.message);
  }
};


