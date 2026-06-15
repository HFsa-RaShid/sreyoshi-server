import { IProduct } from './product.interface';
import { Product } from './product.model';
import { uploadToCloudinary } from '../../utils/uploadConfig'; // আপনার প্রজেক্টের সঠিক পাথ দিন

// ১. প্রোডাক্ট তৈরি করার সার্ভিস (মেইন গ্যালারি এবং শেড ইমেজ একসাথে হ্যান্ডেল হবে)
const createProductIntoDB = async (
  productData: Partial<IProduct>, 
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  
  // 🔹 ক. মেইন প্রোডাক্ট ইমেজ আপলোড লজিক (images)
  if (files && files['images'] && files['images'].length > 0) {
    const mainImageUrls = [];
    for (const file of files['images']) {
      const url = await uploadToCloudinary(file);
      mainImageUrls.push(url);
    }
    productData.images = mainImageUrls;
  } else {
    throw new Error('Product main images are required!');
  }

  // 🔹 খ. মেকআপ শেড ইমেজ আপলোড এবং ডাইনামিক অবজেক্ট ম্যাপিং (shadeImages)
  if (productData.shades && productData.shades.length > 0) {
    if (files && files['shadeImages'] && files['shadeImages'].length > 0) {
      const shadeFiles = files['shadeImages'];

      // পাঠানো শেড ডাটার সংখ্যার সাথে আপলোড করা ফাইলের সংখ্যা মিলছে কিনা চেক করা
      if (shadeFiles.length !== productData.shades.length) {
        throw new Error('The number of uploaded shade images must match the number of shades provided!');
      }

      // সিরিয়াল অনুযায়ী প্রতিটা ফাইলের ক্লাউডিনারি URL নিজ নিজ শেড অবজেক্টের 'shadeImage'-এ সেট করা
      for (let i = 0; i < productData.shades.length; i++) {
        const url = await uploadToCloudinary(shadeFiles[i]);
        productData.shades[i].shadeImage = url;
      }
    } else {
      throw new Error('Shade images are required for products with shades!');
    }
  }

  const result = await Product.create(productData);
  return result;
};

// ২. সব প্রোডাক্ট খোঁজার সার্ভিস
const getAllProductsFromDB = async () => {
  const result = await Product.find().populate('category');
  return result;
};

// ৩. একটি নির্দিষ্ট প্রোডাক্ট খোঁজার সার্ভিস (productCode দিয়ে)
const getSingleProductFromDB = async (productCode: string) => {
  const result = await Product.findOne({ productCode }).populate('category');
  return result;
};

// ৪. প্রোডাক্ট আপডেট করার সার্ভিস
const updateProductInDB = async (
  productCode: string, 
  productData: Partial<IProduct>, 
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  
  // আপডেট করার সময় যদি মেইন গ্যালারির নতুন ছবি পাঠানো হয়
  if (files && files['images'] && files['images'].length > 0) {
    const mainImageUrls = [];
    for (const file of files['images']) {
      const url = await uploadToCloudinary(file);
      mainImageUrls.push(url);
    }
    productData.images = mainImageUrls;
  }

  // আপডেট করার সময় যদি নতুন শেড ইমেজ পাঠানো হয়
  if (productData.shades && productData.shades.length > 0 && files && files['shadeImages'] && files['shadeImages'].length > 0) {
    const shadeFiles = files['shadeImages'];
    if (shadeFiles.length === productData.shades.length) {
      for (let i = 0; i < productData.shades.length; i++) {
        const url = await uploadToCloudinary(shadeFiles[i]);
        productData.shades[i].shadeImage = url;
      }
    }
  }

  const result = await Product.findOneAndUpdate({ productCode }, productData, {
    new: true,
    runValidators: true,
  });
  return result;
};

// ৫. প্রোডাক্ট ডিলিট করার সার্ভিস
const deleteProductFromDB = async (productCode: string) => {
  const result = await Product.findOneAndDelete({ productCode });
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductFromDB,
};