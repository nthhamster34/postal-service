import { IPackage } from '../interfaces/IPackage';
import { query } from "../config/database";

export abstract class Package implements IPackage {
    ID: number;
    SenderName: string;
    ReceiverName: string;
    SenderAddress: string;
    ReceiverAddress: string;
    Weight: number;
    CostPerUnitWeight: number;
    Status: string;
    TrackingNumber: string;

    constructor(
        pID: number,
        pSenderName: string,
        pReceiverName: string,
        pSenderAddress: string,
        pReceiverAddress: string,
        pWeight: number,
        pCostPerUnitWeight: number
    ) {
        this.ID = pID;
        this.SenderName = pSenderName;
        this.ReceiverName = pReceiverName;
        this.SenderAddress = pSenderAddress;
        this.ReceiverAddress = pReceiverAddress;
        this.Weight = pWeight;
        this.CostPerUnitWeight = pCostPerUnitWeight;
        
        this.Status = "Created";
        this.TrackingNumber = "";
    }

    calculateCost(): number {
        return this.Weight * this.CostPerUnitWeight;
    }

    printLabel(): void {
        console.log('=========== Package Label ===========');
        console.log(`Sender: ${this.SenderName} (${this.SenderAddress})`);
        console.log(`Receiver: ${this.ReceiverName} (${this.ReceiverAddress})`);
        console.log(`Weight: ${this.Weight} kg`);
        console.log(`Status: ${this.Status}`);
        console.log(`Tracking Number: ${this.TrackingNumber}`);
        console.log('=====================================');
    }

    updateStatus(pStatus: string): void {
        this.Status = pStatus;
    }

    setTrackingNumber(pTrackingNumber: string): void {
        this.TrackingNumber = pTrackingNumber;
    }
    
    abstract saveToDatabase(): Promise<void>;

    static async findAll(): Promise<any[]> {
        const result = await query('SELECT * FROM packages ORDER BY "ID"');
        return result.rows;
    }    

    static async findById(id: number): Promise<any> {
        const result = await query('SELECT * FROM packages WHERE "ID" = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0]; 
    }    
}