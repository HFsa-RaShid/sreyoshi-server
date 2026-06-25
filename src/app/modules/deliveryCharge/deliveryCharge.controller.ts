import { Request, Response } from 'express';
import { DeliveryChargeService } from './deliveryCharge.service';

const createZone = async (req: Request, res: Response) => {
  try {
    const result = await DeliveryChargeService.createZone(req.body);
    res.status(201).json({ success: true, message: 'Delivery zone created', data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllZones = async (req: Request, res: Response) => {
  try {
    const result = await DeliveryChargeService.getAllZones();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateZone = async (req: Request, res: Response) => {
  try {
    const result = await DeliveryChargeService.updateZone(req.params.id as string, req.body);
    res.status(200).json({ success: true, message: 'Zone updated successfully', data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteZone = async (req: Request, res: Response) => {
  try {
    await DeliveryChargeService.deleteZone(req.params.id as string);
    res.status(200).json({ success: true, message: 'Zone purged successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCalculateCharge = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ success: false, message: 'City parameter is required' });
    }
    const result = await DeliveryChargeService.calculateChargeForCity(city as string);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const DeliveryChargeController = {
  createZone,
  getAllZones,
  updateZone,
  deleteZone,
  getCalculateCharge,
};