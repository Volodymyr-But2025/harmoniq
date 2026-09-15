import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getUsers,
  getUserById,
  getCurrentUser,
  getSavedArticles,
  addArticleToSavedArticles,
  deleteArticleFromSavedArticles,
  updateUserAvatar,
  getTopCreators,
} from '../controllers/userController.js';

import {
  getUsersSchema,
  getUserByIdSchema,
  getSavedArticlesSchema,
} from '../validations/userValidation.js';

import { authenticate } from '../middleware/authenticate.js';
import { getArticleByIdSchema } from '../validations/articlesValidation.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/users', celebrate(getUsersSchema), getUsers);
router.get('/users/me', authenticate, getCurrentUser);
router.get(
  '/saved-articles',
  authenticate,
  celebrate(getSavedArticlesSchema),
  getSavedArticles,
);
router.get('/users/top-creators', getTopCreators);
router.get('/users/:id', celebrate(getUserByIdSchema), getUserById);

router.post(
  '/saved-articles/:id',
  authenticate,
  celebrate(getArticleByIdSchema),
  addArticleToSavedArticles,
);
router.delete(
  '/saved-articles/:id',
  authenticate,
  celebrate(getArticleByIdSchema),
  deleteArticleFromSavedArticles,
);
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;
