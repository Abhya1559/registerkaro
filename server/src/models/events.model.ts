import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    jobId: {
      type: String,
      required: true,
    },

    sequence: {
      type: Number,
      required: true,
    },

    level: {
      type: String,
      enum: ["INFO", "WARN", "ERROR"],
      required: true,
    },

    phase: {
      type: String,
      required: true,
    },

    step: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

eventSchema.index({ jobId: 1, sequence: 1 });

export default model("Event", eventSchema);
