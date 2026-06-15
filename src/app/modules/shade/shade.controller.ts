import { Request, Response, NextFunction } from 'express';
import { ShadeServices } from './shade.service';

const createShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ success: true, message: 'Shade configuration saved!', data: await ShadeServices.createShadeConfigIntoDB(req.body) });
  } catch (error) { next(error); }
};

const getAllShadeConfigs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, data: await ShadeServices.getAllShadeConfigsFromDB() });
  } catch (error) { next(error); }
};

const getSingleShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, data: await ShadeServices.getSingleShadeConfigFromDB(req.params.id as string) });
  } catch (error) { next(error); }
};

const updateShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, message: 'Shade configuration updated!', data: await ShadeServices.updateShadeConfigInDB(req.params.id as string, req.body) });
  } catch (error) { next(error); }
};

const deleteShadeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ShadeServices.deleteShadeConfigFromDB(req.params.id as string);
    res.status(200).json({ success: true, message: 'Shade configuration deleted!' });
  } catch (error) { next(error); }
};

export const ShadeController = {
  createShadeConfig,
  getAllShadeConfigs,
  getSingleShadeConfig,
  updateShadeConfig,
  deleteShadeConfig
};