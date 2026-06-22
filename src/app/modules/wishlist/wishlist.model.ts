import { Schema, model } from 'mongoose';
import { IWishlist, WishlistModel } from './wishlist.interface';

const wishlistItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
  },
  { _id: false } // আইটেমের আলাদা আইডির দরকার নেই, শুধু প্রোডাক্ট আইডি থাকলেই হবে
);

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // এক ইউজারের একটাই উইশলিস্ট থাকবে
    products: [wishlistItemSchema],
  },
  { timestamps: true }
);

export const Wishlist = model<IWishlist, WishlistModel>('Wishlist', wishlistSchema);