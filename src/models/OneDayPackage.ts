import { query } from '../config/database';
import { IOneDayPackage } from '../interfaces/IOneDayPackage';
import { Package } from './Package';


export class OneDayPackage extends Package implements IOneDayPackage {
    FlatFee: number;
    ShippingMethod: string;

    constructor(
        pID: number,
        pSenderName: string,
        pReceiverName: string,
        pSenderAddress: string,
        pReceiverAddress: string,
        pWeight: number,
        pCostPerUnitWeight: number,
        pFlatFee: number
    ) {
        super(pID, pSenderName, pReceiverName, pSenderAddress, pReceiverAddress, pWeight, pCostPerUnitWeight);
        this.FlatFee = pFlatFee;
        this.ShippingMethod = "One-Day";
    }

    calculateCost(): number {
        return super.calculateCost() + Number(this.FlatFee);
    }

    async saveToDatabase(): Promise<void> {
        if (this.ID === 0) {
            // INSERT
            const sql = `
            INSERT INTO packages (
                "SenderName", "ReceiverName", "SenderAddress", "ReceiverAddress",
                "Weight", "CostPerUnitWeight", "Status", "TrackingNumber",
                "FlatFee", "ShippingMethod"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;
    
            const values = [
                this.SenderName,
                this.ReceiverName,
                this.SenderAddress,
                this.ReceiverAddress,
                this.Weight,
                this.CostPerUnitWeight,
                this.Status,
                this.TrackingNumber,
                this.FlatFee,
                this.ShippingMethod
            ];
    
            await query(sql, values);
        } else {
            // UPDATE
            const sql = `
            UPDATE packages
            SET
                "SenderName" = $1,
                "ReceiverName" = $2,
                "SenderAddress" = $3,
                "ReceiverAddress" = $4,
                "Weight" = $5,
                "CostPerUnitWeight" = $6,
                "Status" = $7,
                "FlatFee" = $8,
                "ShippingMethod" = $9
            WHERE "ID" = $10
            `;
    
            const values = [
                this.SenderName,
                this.ReceiverName,
                this.SenderAddress,
                this.ReceiverAddress,
                this.Weight,
                this.CostPerUnitWeight,
                this.Status,
                this.FlatFee,
                this.ShippingMethod,
                this.ID
            ];
    
            await query(sql, values);
        }
    }
}