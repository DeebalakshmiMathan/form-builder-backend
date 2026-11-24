import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    // Validated key/value pairs keyed by field.key
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    meta: { ip: String, userAgent: String },
  },
  { timestamps: { createdAt: true, updatedAt: false }, minimize: false }
);

// Serves "list submissions of a form, newest first" with no in-memory sort
submissionSchema.index({ formId: 1, createdAt: -1 });

export const Submission = mongoose.model('Submission', submissionSchema);
