import { model, Schema } from 'mongoose';

const articleSchema = new Schema(
  {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

articleSchema.index({ ownerId: 1, createdAt: -1 });
articleSchema.index({ rate: -1 });

export const Article = model('Article', articleSchema);
