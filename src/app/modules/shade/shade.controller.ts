import { Request, Response, NextFunction } from 'express';
import { ShadeServices } from './shade.service';

const createShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const result = await ShadeServices.createShadeConfigIntoDB(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Shade configuration saved successfully!', 
      data: result 
    });
  } catch (error) { 
    next(error); 
  }
};

const getAllShadeConfigs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemName, subCategory } = req.query;
    const query: Record<string, any> = {};
    
    if (itemName) query.itemName = itemName;
    if (subCategory) query.subCategory = (subCategory as string).toUpperCase();

    const result = await ShadeServices.getAllShadeConfigsFromDB(query);
    res.status(200).json({ success: true, data: result });
  } catch (error) { 
    next(error); 
  }
};

const getSingleShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ShadeServices.getSingleShadeConfigFromDB(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) { 
    next(error); 
  }
};

const updateShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ShadeServices.updateShadeConfigInDB(req.params.id as string, req.body);
    
    res.status(200).json({ 
      success: true, 
      message: 'Shade configuration updated successfully!', 
      data: result 
    });
  } catch (error) { 
    next(error); 
  }
};

const deleteShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ShadeServices.deleteShadeConfigFromDB(req.params.id as string);
    res.status(200).json({ success: true, message: 'Shade configuration deleted!' });
  } catch (error) { 
    next(error); 
  }
};

export const ShadeController = {
  createShadeConfig,
  getAllShadeConfigs,
  getSingleShadeConfig,
  updateShadeConfig,
  deleteShadeConfig
};