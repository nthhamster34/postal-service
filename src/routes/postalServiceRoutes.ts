import express from "express";
import { renderHome, viewPackage, renderCreateForm, createPackage, renderEditForm, updatePackage, printPackageLabel } from '../controllers/postalServiceController'

const router = express.Router();

router.get('/', renderHome);
router.get("/view/:id", viewPackage);
router.get("/create", renderCreateForm);
router.post("/create", createPackage);
router.get("/edit/:id", renderEditForm);
router.post("/edit/:id", updatePackage);
router.get("/print/:id", printPackageLabel);

export default router;