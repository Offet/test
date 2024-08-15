import { TimeCapsule } from '../models/time_capsule.js'; // Replace with your model paths
import { User } from '../models/user_model.js';
import timeCapsuleSchema from '../validators/time_capsule.js';


export const getTimeCapsules = async (req, res) => {
  try {
    
    const alltimeCapsules = await TimeCapsule.find();

    res.status(200).json({ timeCapsules: alltimeCapsules });
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching time capsules' });
  }
};

export const getTimeCapsuleById = async (req, res) => {
  const { id } = req.params;

  try {
    const timeCapsule = await TimeCapsule.findById(id).populate('content');

    if (!timeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }

    res.json(timeCapsule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching time capsule' });
  }
};

export const createTimeCapsule = async (req, res) => {
  try{
  
  const { value, error} = timeCapsuleSchema.validate({...req.body});
  if (error) {
    return res.status(400).send(error.details[0].message)
  };

  // Finding the user by ID
  const userId = req.session?.user?.id || req?.user?.id; 
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send('User not found');
  }

  // Create or update the user timeCapsule
  const timeCapsule = await TimeCapsule.findOneAndUpdate(
    { user: userId }, // Find by user ID
    value,
    { new: true, upsert: true } 
  );

    // Associate the user timeCapsule with the user
    user.timeCapsule = timeCapsule._id;
    await user.save();

    // Return the user timeCapsule
    res.status(201).json({ message:"time capsule has been added.",timeCapsule
     });


    // await timeCapsule.save();...this part is not needed

    res.status(201).json(timeCapsule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating time capsule' });
  }
};

export const updateTimeCapsule = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Validate updates (optional)

  try {
    const updatedTimeCapsule = await TimeCapsule.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTimeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }

    res.json(updatedTimeCapsule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating time capsule' });
  }
};

export const deleteTimeCapsule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTimeCapsule = await TimeCapsule.findByIdAndDelete(id);

    if (!deletedTimeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }

    res.json({ message: 'Time capsule deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting time capsule' });
  }
};

