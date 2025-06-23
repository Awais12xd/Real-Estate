import express from 'express';
import { updateProfile, userController , deleteUser , getUser} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js'; 
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", userController );
router.post('/updateProfile/:id', 
    verifyToken,
     upload.single('image')
    ,updateProfile ) 
router.delete("/delete/:id", verifyToken, deleteUser); 
router.get("/:id" , verifyToken ,getUser)

export default router;