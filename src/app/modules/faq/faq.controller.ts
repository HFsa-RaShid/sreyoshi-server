import { Request, Response, NextFunction } from 'express';
import { FaqServices } from './faq.service';

const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FaqServices.createFaqIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FaqServices.getAllFaqsFromDB();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FaqServices.getSingleFaqFromDB(req.params.id as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FaqServices.updateFaqInDB(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await FaqServices.deleteFaqFromDB(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const FaqControllers = {
  createFaq,
  getAllFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq,
};