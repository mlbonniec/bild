import { Router } from 'express';
import passport from 'passport';

import applications from './applications';
import images from './images';

const router = Router();

router.use('/images', images);
router.use('/applications', passport.authenticate('jwt', { session: false }), applications);

export default router;