import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },

    pan: {
      type: String,
      required: true,
    },

    phase: {
      type: String,
      required: true,
      default: "CREATED",
    },

    status: {
      type: String,
      enum: ["RUNNING", "SUCCESS", "FAILED", "CANCELLED"],
      default: "RUNNING",
    },

    userId: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      default: null,
    },

    error: {
      type: String,
      default: null,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

jobSchema.index({ phase: 1, updatedAt: -1 });

export default model("Job", jobSchema);
