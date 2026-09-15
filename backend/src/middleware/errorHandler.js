import { isHttpError } from 'http-errors';
import multer from 'multer';

export const errorHandler = (error, req, res, next) => {
  if (isHttpError(error)) {
    return res.status(error.status).json({
      message: error.message || error.name,
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 1MB',
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  console.error(error);

  res.status(500).json({
    message: 'Internal server error',
  });
};
