import { Request, Response } from "express";
import { Package } from "../models/Package";
import { OneDayPackage } from "../models/OneDayPackage";
import { TwoDayPackage } from "../models/TwoDayPackage";

// View Home
export const renderHome = async (req: Request, res: Response) => {
    try {
        // Get all rows from the model
        const rows = await Package.findAll();

        // Convert data to objects
        const packages = rows.map(convertResultToObject);

        res.render("packages", { 
            title: "Packages", 
            packages 
        });
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).send("Internal Server Error");
    }
};

// View Package Details
export const viewPackage = async (req: Request, res: Response) => {
    try {
        // Find package by id
        const id = parseInt(req.params.id);
        const row = await Package.findById(id);

        // Return error if not found
        if (!row) {
            res.status(404).send("Package not found!");
            return 
        }

        // Convert result to object
        const packageItem = convertResultToObject(row);

        res.render("packageItem", {
            title: "Package Details",
            pageType: "view",
            package: packageItem,
        });
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Render Create Form
export const renderCreateForm = (req: Request, res: Response) => {
    try {
        res.render("packageItem", { 
            title: "Create Package", 
            pageType: "new" 
        });
    } catch (error) {
        console.error("Error rendering create form:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Create New Package
export const createPackage = async (req: Request, res: Response) => {
    const {
        SenderName,
        ReceiverName,
        SenderAddress,
        ReceiverAddress,
        Weight,
        CostPerUnitWeight,
        FlatFee,
        ShippingMethod
    } = req.body;

    // Validate required fields
    if (!SenderName || !SenderAddress || !ReceiverName || !ReceiverAddress || !Weight || !CostPerUnitWeight || !ShippingMethod || !FlatFee) {
        res.status(400).send('Invalid Data!');
        return;
    }

    try {
        
        let pkg: any;

        if (ShippingMethod === "One-Day") {
            // If shipping method is One-Day, create an instance of OneDayPackage
            pkg = new OneDayPackage(
                0,
                SenderName,
                ReceiverName,
                SenderAddress,
                ReceiverAddress,
                parseFloat(Weight),
                parseFloat(CostPerUnitWeight),
                parseFloat(FlatFee)
            );
        } else if (ShippingMethod === "Two-Day") {
            // If shipping method is Two-Day, create an instance of TwoDayPackage
            pkg = new TwoDayPackage(
                0,
                SenderName,
                ReceiverName,
                SenderAddress,
                ReceiverAddress,
                parseFloat(Weight),
                parseFloat(CostPerUnitWeight),
                parseFloat(FlatFee)
            );
        } else {
            res.status(400).send("Invalid Shipping Method!");
            return
        }

        // Generate and set tracking number
        const trackingNumber = `${SenderName.charAt(0)}${ReceiverName.charAt(0)}${Math.floor(Math.random() * 900000 + 100000)}`;        
        pkg.setTrackingNumber(trackingNumber);

        // Save to database
        await pkg.saveToDatabase();

        res.redirect("/");
    } catch (error) {
        console.error("Error creating package:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Render Edit Form
export const renderEditForm = async (req: Request, res: Response) => {
    try {
        // Find package by id
        const id = parseInt(req.params.id);
        const row = await Package.findById(id);

        // Verify that it exists
        if (!row) {
            res.status(404).send("Package not found!");
            return
        }

        // Convert to object
        const packageItem = convertResultToObject(row);

        res.render("packageItem", {
            title: "Edit Package",
            pageType: "edit",
            package: packageItem,
        });
    } catch (error) {
        console.error("Error rendering edit form:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Update Existing Package
export const updatePackage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);      

    const {
        SenderName,
        ReceiverName,
        SenderAddress,
        ReceiverAddress,
        Weight,
        CostPerUnitWeight,
        FlatFee,
        Status,
        ShippingMethod
    } = req.body;

    // Validate required fields
    if (!SenderName || !SenderAddress || !ReceiverName || !ReceiverAddress || !Weight || !CostPerUnitWeight || !ShippingMethod || !FlatFee) {
        res.status(400).send('Invalid Data!');
        return;
    }

    try {          

        let pkg: any;

        if (ShippingMethod === "One-Day") {
            // If shipping method is One-Day, update the instance of OneDayPackage
            pkg = new OneDayPackage(
                id,
                SenderName,
                ReceiverName,
                SenderAddress,
                ReceiverAddress,
                parseFloat(Weight),
                parseFloat(CostPerUnitWeight),
                parseFloat(FlatFee)
            );
        } else if (ShippingMethod === "Two-Day") {
            // If shipping method is Two-Day, update the instance of TwoDayPackage
            pkg = new TwoDayPackage(
                id,
                SenderName,
                ReceiverName,
                SenderAddress,
                ReceiverAddress,
                parseFloat(Weight),
                parseFloat(CostPerUnitWeight),
                parseFloat(FlatFee)
            );
        } else {
            res.status(400).send("Invalid Shipping Method!");
            return
        }
        
        pkg.updateStatus(Status);

        await pkg.saveToDatabase();

        res.redirect(`/view/${id}`);
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Print Package Label
export const printPackageLabel = async (req: Request, res: Response) => {
    try {
        // Get package by id
        const id = parseInt(req.params.id);
        const row = await Package.findById(id);

        // Check if it exists
        if (!row) {
            res.status(404).send("Package not found!");
            return
        }

        // Convert to object
        const packageItem = convertResultToObject(row);

        // Call function to print details in console for debug purposes
        packageItem.printLabel(); 

        res.render("packageLabel", {
            title: "Print Package Label",
            package: packageItem,
        });
    } catch (error) {
        console.error("Error printing package label:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Helper to convert DB row into correct package object
function convertResultToObject(row: any): any {
    if (row.ShippingMethod === "One-Day") {
        const pkg = new OneDayPackage(
            row.ID,
            row.SenderName,
            row.ReceiverName,
            row.SenderAddress,
            row.ReceiverAddress,
            row.Weight,
            row.CostPerUnitWeight,
            row.FlatFee
        );
        pkg.setTrackingNumber(row.TrackingNumber);
        pkg.updateStatus(row.Status);
        return pkg;
    } else if (row.ShippingMethod === "Two-Day") {
        const pkg = new TwoDayPackage(
            row.ID,
            row.SenderName,
            row.ReceiverName,
            row.SenderAddress,
            row.ReceiverAddress,
            row.Weight,
            row.CostPerUnitWeight,
            row.FlatFee
        );
        pkg.setTrackingNumber(row.TrackingNumber);
        pkg.updateStatus(row.Status);
        return pkg;
    }
}