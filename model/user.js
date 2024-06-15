import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  displayName: { type: String, required: true },
  statusMessage: { type: String, required: true },
  pictureUrl: { type: String, required: true }
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
