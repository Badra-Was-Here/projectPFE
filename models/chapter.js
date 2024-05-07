import connectMongoDB from "@/lib/mongodb";
import mongoose, { Schema } from "mongoose";


// Mongoose Schema for Chapter

const chapterSchema = new Schema(
  {
    title: String,
    description: String,
    videoUrl: String,
    position: Number,
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    muxData: {
      type: Schema.Types.ObjectId,
      ref: "MuxData",
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },

    userProgress: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserProgress",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Mongoose Schema for MuxData

const muxDataSchema = new Schema(
  {
    assetId: String ,
    playbackId: String,
    chapterId: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: "Chapter",
    },
  },
  { timestamps: true }
);

// Mongoose Schema for UserProgress

const userProgressSchema = new Schema({
    userId: String,
    chapterId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chapter' 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
  }, { timestamps: true });


  // Create models from the schemas
 mongoose.models = {};
 const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);
 const MuxData =  mongoose.models.MuxData || mongoose.model('MuxData', muxDataSchema);
 const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);
// export default mongoose.model('Chapter', chapterSchema);
export  { Chapter, MuxData, UserProgress };
