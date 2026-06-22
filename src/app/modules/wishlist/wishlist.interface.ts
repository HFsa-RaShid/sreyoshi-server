import { Model, Types } from 'mongoose';

export type IWishlistItem = {
  productId: Types.ObjectId;
};

export type IWishlist = {
  userId: Types.ObjectId;
  products: IWishlistItem[];
};

export type WishlistModel = Model<IWishlist, Record<string, unknown>>;