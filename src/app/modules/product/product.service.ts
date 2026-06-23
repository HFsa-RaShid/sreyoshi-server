import { IProduct } from './product.interface';
import { Product } from './product.model';
import { ShadeManagement } from '../shade/shade.model'; 
import { uploadToCloudinary } from '../../utils/uploadConfig'; 

const createProductIntoDB = async (
  productData: Partial<IProduct>, 
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  // ১. মেইন গ্যালারি ইমেজ আপলোড
  if (files && files['commonImages'] && files['commonImages'].length > 0) {
    const commonUrls = [];
    for (const file of files['commonImages']) {
      commonUrls.push(await uploadToCloudinary(file));
    }
    productData.commonImages = commonUrls;
  } else {
    throw new Error('Remaining common gallery images are required!');
  }

  // ২. শেড় প্রসেসিং ও ইমেজ ক্লাউডিনারি আপলোড লজিক
  if (productData.shades && productData.shades.length > 0) {
    const shadeConfig = await ShadeManagement.findOne({
      category: productData.category,
      subCategory: productData.subCategory?.toUpperCase(),
      itemName: productData.itemName
    });

    if (!shadeConfig || !shadeConfig.availableShades || shadeConfig.availableShades.length === 0) {
      throw new Error(`No active shades config found for "${productData.itemName}".`);
    }

    const allowedShadeNames = shadeConfig.availableShades.map(s => s.shadeName.trim().toLowerCase());
    let calculatedTotalStock = 0; 
    
    const uploadedShadeFiles = files?.['shadeImages'] || [];
    let fileIndex = 0;

    for (const currentShade of productData.shades) {
      const targetName = currentShade.shadeName.trim().toLowerCase();

      if (!allowedShadeNames.includes(targetName)) {
        throw new Error(`Shade "${currentShade.shadeName}" is unauthorized!`);
      }

      const dbShade = shadeConfig.availableShades.find(
        s => s.shadeName.trim().toLowerCase() === targetName
      ) as any; // 💡 ফিক্স: 'as any' টাইপ কাস্টিং করা হলো যেন 'shadeImage' প্রপার্টি এরর না দেয়
      
      currentShade.shadeColorCode = dbShade?.shadeColorCode || "#000000";
      
      if (!currentShade.shadeImage && fileIndex < uploadedShadeFiles.length) {
        currentShade.shadeImage = await uploadToCloudinary(uploadedShadeFiles[fileIndex]);
        fileIndex++;
      } else if (!currentShade.shadeImage) {
        // 💡 ফিক্স: গ্লোবাল স্কিমায় যদি 'image' নামে থাকে তবে সেটা চেক করবে, নাহলে 'shadeImage'
        currentShade.shadeImage = dbShade?.shadeImage || dbShade?.image || "";
      }
      
      calculatedTotalStock += Number(currentShade.stock) || 0;
    }
    
    productData.totalStock = calculatedTotalStock;
  } else {
    productData.shades = undefined;
    productData.totalStock = productData.totalStock || 0;
  }

  productData.availability = productData.totalStock > 0 ? 'In Stock' : 'Out of Stock';
  return await Product.create(productData);
};

const updateProductInDB = async (
  productCode: string, 
  productData: Partial<IProduct>, 
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const existingProduct = await Product.findOne({ productCode });
  if (!existingProduct) throw new Error('Product not found!');

  // ১. মেইন গ্যালারি ইমেজ আপলোড (যদি নতুন ফাইল থাকে)
  if (files && files['commonImages'] && files['commonImages'].length > 0) {
    const commonUrls = [];
    for (const file of files['commonImages']) {
      commonUrls.push(await uploadToCloudinary(file));
    }
    productData.commonImages = commonUrls;
  }

  // ২. ডাইনামিক শেড ভ্যালিডেশন, ফাইল আপলোড এবং স্টক ক্যালকুলেশন
  if (productData.shades && productData.shades.length > 0) {
    const shadeConfig = await ShadeManagement.findOne({
      category: productData.category || existingProduct.category,
      subCategory: (productData.subCategory || existingProduct.subCategory).toUpperCase(),
      itemName: productData.itemName || existingProduct.itemName
    });

    if (!shadeConfig || !shadeConfig.availableShades) {
      throw new Error(`Configuration settings missing for this item.`);
    }

    const allowedShades = shadeConfig.availableShades.map(s => s.shadeName.trim().toLowerCase());
    let calculatedTotalStock = 0;

    const uploadedShadeFiles = files?.['shadeImages'] || [];
    let fileIndex = 0;

    for (const currentShade of productData.shades) {
      const targetName = currentShade.shadeName.trim().toLowerCase();
      if (!allowedShades.includes(targetName)) throw new Error(`Unauthorized shade: "${currentShade.shadeName}"!`);
      
      const dbShade = shadeConfig.availableShades.find(
        s => s.shadeName.trim().toLowerCase() === targetName
      ) as any; // 💡 ফিক্স: 'as any' টাইপ কাস্টিং করা হলো
      
      currentShade.shadeColorCode = dbShade?.shadeColorCode || "#000000";
      
      if (uploadedShadeFiles.length > 0 && fileIndex < uploadedShadeFiles.length && (!currentShade.shadeImage || currentShade.shadeImage.startsWith('blob:') || currentShade.shadeImage === '')) {
         currentShade.shadeImage = await uploadToCloudinary(uploadedShadeFiles[fileIndex]);
         fileIndex++;
      } else if (!currentShade.shadeImage) {
         // 💡 ফিক্স: গ্লোবাল স্কিমায় যদি 'image' নামে থাকে তবে সেটা চেক করবে, নাহলে 'shadeImage'
         currentShade.shadeImage = dbShade?.shadeImage || dbShade?.image || "";
      }
      
      calculatedTotalStock += Number(currentShade.stock) || 0;
    }
    productData.totalStock = calculatedTotalStock;
  } else {
    productData.shades = undefined;
    productData.totalStock = productData.totalStock !== undefined ? productData.totalStock : existingProduct.totalStock;
  }

  // ৩. স্টক স্ট্যাটাস আপডেট
  if (productData.totalStock !== undefined) {
    productData.availability = productData.totalStock > 0 ? 'In Stock' : 'Out of Stock';
  }

  return await Product.findOneAndUpdate({ productCode }, productData, { new: true, runValidators: true });
};

const getAllProductsFromDB = async () => {
  return await Product.find().populate('category').populate('brand');
};

const getSingleProductFromDB = async (productCode: string) => {
  return await Product.findOne({ productCode }).populate('category').populate('brand');
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