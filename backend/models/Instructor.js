const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Function to generate unique instructor ID
const generateInstructorID = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `INST${timestamp}${random}`.toUpperCase();
};

const InstructorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    instructorID: {
      type: String,
      required: true,
      unique: true,
      default: generateInstructorID,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    assignedCourse: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password if modified
InstructorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
InstructorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
InstructorSchema.methods.toJSON = function () {
  const instructor = this.toObject();
  delete instructor.password;
  return instructor;
};

module.exports = mongoose.model("instructors", InstructorSchema);
