import { Request, Response } from "express";
export declare const create: (req: Request, res: Response) => Promise<void>;
export declare const getClient: (req: Request, res: Response) => Promise<void>;
export declare const getAll: (req: Request, res: Response) => Promise<void>;
export declare const getOne: (req: Request, res: Response) => Promise<void>;
export declare const updateOne: (req: Request, res: Response) => Promise<void>;
export declare const updateCopy: (req: Request, res: Response) => Promise<void>;
