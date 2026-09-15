import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true },
    avatar: {
      type: String,
      required: false,
      default: '',
    },
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    name: { type: String, trim: true },
    avatarUrl: { type: String, trim: true, default: '' },
    articlesAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
export const User = model('User', userSchema);
