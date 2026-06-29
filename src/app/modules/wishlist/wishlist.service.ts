import { Types } from 'mongoose';
import { Wishlist } from './wishlist.model';

// ১. উইশলিস্টে প্রোডাক্ট যোগ করা বা অলরেডি থাকলে রিমুভ করা
const toggleWishlistInDB = async (userId: string, productId: string) => {
  const queryUserId = new Types.ObjectId(userId); 

  let wishlist = await Wishlist.findOne({ userId: queryUserId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId: queryUserId,
      products: [{ productId: new Types.ObjectId(productId) }],
    });
  } else {
    const isProductExist = wishlist.products.some(
      (item) => item.productId.toString() === productId
    );

    if (isProductExist) {
      wishlist.products = wishlist.products.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      wishlist.products.push({ productId: new Types.ObjectId(productId) as any });
    }
    await wishlist.save();
  }

  // 🎯 টপ-লেভেলে এবং নেস্টেড লেভেলে কঠোরভাবে strictPopulate হ্যান্ডেল করা হলো
  return await Wishlist.findById(wishlist._id)
    .setOptions({ strictPopulate: false }) // 👈 একদম রুট লেভেলে অপশন সেট
    .populate({
      path: 'products.productId',
      populate: [
        { path: 'categoryId', options: { strictPopulate: false } },
        { path: 'brandId', options: { strictPopulate: false } },
        { path: 'variants.weightId', options: { strictPopulate: false } }
      ]
    });
};

// ২. নির্দিষ্ট ইউজারের পুরো উইশলিস্ট খুঁজে বের করা
const getMyWishlistFromDB = async (userId: string) => {
  const queryUserId = new Types.ObjectId(userId); 
  
  return await Wishlist.findOne({ userId: queryUserId })
    .setOptions({ strictPopulate: false }) // 👈 একদম রুট লেভেলে অপশন সেট
    .populate({
      path: 'products.productId',
      populate: [
        { path: 'categoryId', options: { strictPopulate: false } },
        { path: 'brandId', options: { strictPopulate: false } },
        { path: 'variants.weightId', options: { strictPopulate: false } }
      ]
    });
};

// ৩. উইশলিস্ট একদম খালি করে ফেলা
const clearWishlistFromDB = async (userId: string) => {
  const queryUserId = new Types.ObjectId(userId);
  return await Wishlist.findOneAndUpdate(
    { userId: queryUserId },
    { $set: { products: [] } },
    { new: true }
  );
};

// ৪. সিঙ্গল আইটেম রিমুভ করা
const removeSingleItemFromWishlistInDB = async (userId: string, productId: string) => {
  const queryUserId = new Types.ObjectId(userId);
  return await Wishlist.findOneAndUpdate(
    { userId: queryUserId },
    { $pull: { products: { productId: new Types.ObjectId(productId) } } },
    { new: true }
  )
    .setOptions({ strictPopulate: false }) // 👈 একদম রুট লেভেলে অপশন সেট
    .populate({
      path: 'products.productId',
      populate: [
        { path: 'categoryId', options: { strictPopulate: false } }, 
        { path: 'brandId', options: { strictPopulate: false } }, 
        { path: 'variants.weightId', options: { strictPopulate: false } }
      ]
    });
};

export const WishlistServices = {
  toggleWishlistInDB,
  getMyWishlistFromDB,
  clearWishlistFromDB,
  removeSingleItemFromWishlistInDB,
};