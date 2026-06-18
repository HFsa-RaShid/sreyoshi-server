import { Request, Response } from 'express';
import { BrandServices } from './brand.service';

const createBrand = async (req: Request, res: Response) => {
  try {
    const brandData = req.body;
    
    if (req.file) {
      brandData.logo = req.file.path; 
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

const getAllBrands = async (req: Request, res: Response) => {
  try {
    const result = await BrandServices.getAllBrandsFromDB();
    res.status(200).json({
      success: true,
      message: 'Brands fetched successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BrandServices.getSingleBrandFromDB(id as string);
    res.status(200).json({
      success: true,
      message: 'Brand fetched successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.logo = req.file.path;
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

const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await BrandServices.deleteBrandFromDB(id as string);
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully',
      data: null,
    });
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