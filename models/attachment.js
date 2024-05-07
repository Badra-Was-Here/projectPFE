import mongoose, { Schema } from "mongoose";

const attachmentSchema = new Schema(
  {
    name : String , 
    url : String , 
    courseId : String ,
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },

  },
  {
    timestamps: true,
  }
);

const Attachment =
  mongoose.models.Attachment || mongoose.model("Attachment", attachmentSchema);

export default Attachment;
