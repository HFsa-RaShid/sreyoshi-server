import { Wishlist } from './wishlist.model';

// ১. উইশলিস্টে প্রোডাক্ট যোগ করা বা অলরেডি থাকলে রিমুভ করা (Toggle Logic)
const toggleWishlistInDB = async (userId: string, productId: string) => {
  let wishlist = await Wishlist.findOne({ userId });

  // যদি ইউজারের কোনো উইশলিস্ট অ্যাকাউন্ট না থাকে, তবে নতুন তৈরি হবে
  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      products: [{ productId }],
    });
    return wishlist;
  }

  // প্রোডাক্টটি অলরেডি উইশলিস্টে আছে কিনা চেক করা
  const isProductExist = wishlist.products.some(
    (item) => item.productId.toString() === productId
  );

  if (isProductExist) {
    // যদি থাকে, তবে উইশলিস্ট থেকে রিমুভ (Remove) করে দেবে
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );
  } else {
    // যদি না থাকে, তবে নতুন করে পুশ (Add) করবে
    wishlist.products.push({ productId: productId as any });
  }

  await wishlist.save();
  return wishlist;
};

// ২. কোনো নির্দিষ্ট ইউজারের পুরো উইশলিস্ট খুঁজে বের করা (ক্যাটাগরি ও ব্র্যান্ড পপুলেট সহ)
const getMyWishlistFromDB = async (userId: string) => {
  return await Wishlist.findOne({ userId }).populate({
    path: 'products.productId',
    populate: [
      { path: 'categoryId' }, // আপনার ইউআই-তে ক্যাটাগরি অনুযায়ী "Local" বা "Imported" ট্যাগ দেখানোর জন্য
      { path: 'brandId' },
      { path: 'variants.weightId' } // ওজনের ভ্যারিয়েন্ট এবং প্রাইস দেখানোর জন্য
    ]
  });
};

// ৩. উইশলিস্ট একদম খালি করে ফেলা (Clear Wishlist)
const clearWishlistFromDB = async (userId: string) => {
  return await Wishlist.findOneAndUpdate(
    { userId },
    { $set: { products: [] } },
    { new: true }
  );
};

const removeSingleItemFromWishlistInDB = async (userId: string, productId: string) => {
  return await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { products: { productId } } }, // 👈 $pull দিয়ে অ্যারে থেকে স্পেসিফিক অবজেক্ট রিমুভ করা হয়
    { new: true }
  ).populate({
    path: 'products.productId',
    populate: [{ path: 'categoryId' }, { path: 'brandId' }, { path: 'variants.weightId' }]
  });
};

export const WishlistServices = {
  toggleWishlistInDB,
  getMyWishlistFromDB,
  clearWishlistFromDB,
  removeSingleItemFromWishlistInDB,
};