import { Request, Response } from 'express';
import { BrandServices } from './brand.service';
import { uploadToCloudinary } from '../../utils/uploadConfig'; // আপনার সঠিক পাথটি এখানে দিন

const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, status } = req.body;
    const brandData: any = { name, status };
    
    // যদি ফ্রন্টএন্ড থেকে ফাইল আসে (Memory Storage এ এটি req.file হিসেবে থাকবে)
    if (req.file) {
      // ক্লাউডিনারিতে আপলোড করে সিকিউর ইউআরএল নিয়ে আসা
      const imageUrl = await uploadToCloudinary(req.file);
      brandData.logo = imageUrl; 
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Logo file is required!' 
      });
    }

    const result = await BrandServices.createBrandIntoDB(brandData);
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
};

const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;

    // এডিট করার সময় যদি নতুন ইমেজ আপলোড করা হয়
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      updateData.logo = imageUrl;
    }

    const result = await BrandServices.updateBrandInDB(id as string, updateData);
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBrands = async (req: Request, res: Response) => {
  try {
    const result = await BrandServices.getAllBrandsFromDB();
    res.status(200).json({ success: true, message: 'Brands fetched successfully', data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BrandServices.getSingleBrandFromDB(id as string);
    res.status(200).json({ success: true, message: 'Brand fetched successfully', data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await BrandServices.deleteBrandFromDB(id as string);
    res.status(200).json({ success: true, message: 'Brand deleted successfully', data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const BrandControllers = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};