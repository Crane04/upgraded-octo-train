import { Response } from "express";
type ValidationError = {
  field: string;
  message: string;
};

class ApiResponse {
  static success = async (
    res: Response,
    message: string,
    data: object
  ): Promise<object> => {
    return res.status(200).json({
      message,
      data,
      status: "success",
    });
  };

  static error = async (
    res: Response,
    error: string,
    status: number
  ): Promise<any> => {
    return res.status(status).json({
      error,
      status: "error",
    });
  };

  static validationError = async (
    res: Response,
    message: string,
    error: Array<ValidationError> | string
  ) => {
    return res.status(422).json({
      message,
      error,
      status: "error",
    });
  };
}

export default ApiResponse;
