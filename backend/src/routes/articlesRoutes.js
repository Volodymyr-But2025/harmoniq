import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getArticlesByAuthorController,
  getArticleByIdController,
  getArticlesController,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articlesController.js';
import {
  getArticlesByAuthorValidation,
  getArticleByIdSchema,
  getArticlesSchema,
  createArticlesSchema,
  updateArticleSchema,
  deleteArticleSchema,
} from '../validations/articlesValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/articles', celebrate(getArticlesSchema), getArticlesController);

router.get(
  '/articles/:id',
  celebrate(getArticleByIdSchema),
  getArticleByIdController,
);

router.post(
  '/articles',
  authenticate,
  upload.single('img'),
  celebrate(createArticlesSchema),
  createArticle,
);

router.get(
  '/articles/author/:ownerId',
  celebrate(getArticlesByAuthorValidation),
  getArticlesByAuthorController,
);

router.patch(
  '/articles/:id',
  authenticate,
  upload.single('img'),
  celebrate(updateArticleSchema),
  updateArticle,
);

router.delete(
  '/articles/:id',
  authenticate,
  celebrate(deleteArticleSchema),
  deleteArticle,
);

export default router;
