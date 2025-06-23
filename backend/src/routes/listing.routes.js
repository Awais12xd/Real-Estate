import express from 'express';
import { createListing , getAllListings , getAllUserListings, deleteListing , updateListing , getSingleListing} from '../controllers/listing.controllers.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post("/create",verifyToken ,  upload.array("images", 6),  createListing);
router.get("/listings/:id", verifyToken, getAllUserListings);
router.delete("/delete/:id", verifyToken, deleteListing); 
router.get("/single-listing/:id" , verifyToken , getSingleListing);
router.post("/update/:id", verifyToken, upload.array("images", 6), updateListing); 
router.get("/getAllListings" , getAllListings)

export default router;