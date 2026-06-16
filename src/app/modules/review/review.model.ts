import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';
import { Product } from '../product/product.model'; // আপনার প্রোডাক্ট মডেলের পাথ দিন

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// ⚡ মঙ্গুজের স্ট্যাটিক মেথড: একটি প্রোডাক্টের রেটিং এভারেজ হিসাব করার জন্য
reviewSchema.statics.calculateAverageRating = async function (productId: string) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
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

// রিভিউ সেভ হওয়ার পর অটোমেটিক রেটিং আপডেট হবে
reviewSchema.post('save', function () {
  (this.constructor as any).calculateAverageRating(this.product);
});

// রিভিউ ডিলিট বা আপডেট হওয়ার পর অটোমেটিক রেটিং আপডেট হবে
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

export const Review = model<IReview>('Review', reviewSchema);