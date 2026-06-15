import { IProduct } from './product.interface';
import { Product } from './product.model';
import { ShadeManagement } from '../shade/shade.model';
import { uploadToCloudinary } from '../../utils/uploadConfig';

const createProductIntoDB = async (
  productData: Partial<IProduct>, 
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  // ১. বাকি ৩টি কমন ইমেজ ক্লাউডিনারিতে আপলোড
  if (files && files['commonImages'] && files['commonImages'].length > 0) {
    const commonUrls = [];
    for (const file of files['commonImages']) {
      commonUrls.push(await uploadToCloudinary(file));
    }
    productData.commonImages = commonUrls;
  } else {
    throw new Error('Remaining 3 common gallery images are required!');
  }

  // ২. যদি প্রোডাক্টের shades ডাটা পাঠানো হয় (শুধুমাত্র তখনই শেড ভ্যালিডেশন চলবে)
  if (productData.shades && productData.shades.length > 0) {
    
    // ট্রিপল চেক ভ্যালিডেশন
    const shadeConfig = await ShadeManagement.findOne({
      category: productData.category,
      subCategory: productData.subCategory?.toUpperCase(),
      itemName: productData.itemName
    });

    if (!shadeConfig || !shadeConfig.availableShades || shadeConfig.availableShades.length === 0) {
      throw new Error(`No active shades config found for "${productData.itemName}". Fix Admin Shades Page first!`);
    }

    // শেড ইমেজ আপলোড ও কালার কোড ম্যাপিং
    if (files && files['shadeImages'] && files['shadeImages'].length > 0) {
      const shadeFiles = files['shadeImages'];
      if (shadeFiles.length !== productData.shades.length) {
        throw new Error('Uploaded shade images count must match total provided shades!');
      }

      const allowedShadeNames = shadeConfig.availableShades.map(s => s.shadeName);

      for (let i = 0; i < productData.shades.length; i++) {
        const currentShade = productData.shades[i];
        if (!allowedShadeNames.includes(currentShade.shadeName)) {
          throw new Error(`Shade "${currentShade.shadeName}" is unauthorized!`);
        }

        const dbShade = shadeConfig.availableShades.find(s => s.shadeName === currentShade.shadeName);
        currentShade.shadeColorCode = dbShade?.shadeColorCode;
        currentShade.shadeImage = await uploadToCloudinary(shadeFiles[i]);
      }
    } else {
      throw new Error('Shade images are mandatory for each variant!');
    }
  } else {
    // যদি প্রোডাক্টের কোনো শেড না থাকে (যেমন: স্কিন কেয়ার), তবে ডাটাবেজে undefined থাকবে
    productData.shades = undefined;
  }

  return await Product.create(productData);
};

const updateProductInDB = async (
  productCode: string, 
  productData: Partial<IProduct>, 
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const existingProduct = await Product.findOne({ productCode });
  if (!existingProduct) throw new Error('Product not found!');

  if (files && files['commonImages'] && files['commonImages'].length > 0) {
    const commonUrls = [];
    for (const file of files['commonImages']) {
      commonUrls.push(await uploadToCloudinary(file));
    }
    productData.commonImages = commonUrls;
  }

  // আপডেট করার সময়ও শেড ডাটা থাকলে শুধুমাত্র তখনই ভ্যালিডেশন ও ইমেজ প্রসেস হবে
  if (productData.shades && productData.shades.length > 0) {
    const shadeConfig = await ShadeManagement.findOne({
      category: productData.category || existingProduct.category,
      subCategory: (productData.subCategory || existingProduct.subCategory).toUpperCase(),
      itemName: productData.itemName || existingProduct.itemName
    });

    if (!shadeConfig || !shadeConfig.availableShades) {
      throw new Error(`Configuration settings missing for this item.`);
    }

    const allowedShades = shadeConfig.availableShades.map(s => s.shadeName);

    if (files && files['shadeImages'] && files['shadeImages'].length > 0) {
      const shadeFiles = files['shadeImages'];
      if (shadeFiles.length !== productData.shades.length) {
        throw new Error('Uploaded shade images count mismatch!');
      }

      for (let i = 0; i < productData.shades.length; i++) {
        const currentShade = productData.shades[i];
        if (!allowedShades.includes(currentShade.shadeName)) throw new Error(`Unauthorized shade!`);

        const dbShade = shadeConfig.availableShades.find(s => s.shadeName === currentShade.shadeName);
        currentShade.shadeColorCode = dbShade?.shadeColorCode;
        currentShade.shadeImage = await uploadToCloudinary(shadeFiles[i]);
      }
    } else {
      for (const currentShade of productData.shades) {
        if (!allowedShades.includes(currentShade.shadeName)) throw new Error(`Unauthorized shade!`);
        const oldShade = existingProduct.shades?.find(s => s.shadeName === currentShade.shadeName);
        if (oldShade) {
          currentShade.shadeImage = oldShade.shadeImage;
          currentShade.shadeColorCode = oldShade.shadeColorCode;
        } else if (!currentShade.shadeImage) {
          throw new Error(`New shade "${currentShade.shadeName}" requires image upload!`);
        }
      }
    }
  }

  return await Product.findOneAndUpdate({ productCode }, productData, { new: true, runValidators: true });
};

const getAllProductsFromDB = async () => {
  return await Product.find().populate('category');
};

const getSingleProductFromDB = async (productCode: string) => {
  return await Product.findOne({ productCode }).populate('category');
};

const deleteProductFromDB = async (productCode: string) => {
  return await Product.findOneAndDelete({ productCode });
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductFromDB,
};