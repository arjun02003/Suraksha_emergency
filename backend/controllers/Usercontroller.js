const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { bloodGroup, emergencyContact } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bloodGroup,
        emergencyContact,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current authenticated user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};