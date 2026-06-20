import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';
import { Product } from '../product/product.model';

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // 💡 Default Active
  },
  { timestamps: true }
);

reviewSchema.statics.calculateAverageRating = async function (productId: string) {
  // 💡 শুধুমাত্র Active রিভিউগুলোর রেটিং ক্যালকুলেট হবে
  const stats = await this.aggregate([
    { $match: { product: productId, status: 'Active' } },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(stats[0].avgRating.toFixed(1)),
      ratingCount: stats[0].nRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      ratingCount: 0,
    });
  }
};

reviewSchema.post('save', function () {
  (this.constructor as any).calculateAverageRating(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

export const Review = model<IReview>('Review', reviewSchema);