import { Request, Response } from "express";

interface CustomRequest extends Request {
  user?: {
    id: number;
    is_admin: boolean;
    full_name: string;
    phone: string;
    credit_balance: number;
  };
}

export const withControllerHandler = (
  handler: (req: CustomRequest, res: Response) => Promise<any>
) => {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message:
          error?.meta?.cause || error?.message || error || "Server Error",
      });
    }
  };
};
