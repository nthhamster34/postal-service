
export interface IPackage {
    ID: number,
    SenderName: string;
    ReceiverName: string;
    SenderAddress: string;
    ReceiverAddress: string;
    Weight: number;
    CostPerUnitWeight: number;
    Status: string;
    TrackingNumber: string;

    calculateCost(): number;
    printLabel(): void;
    updateStatus(pStatus: string): void;
    setTrackingNumber(pTrackingNumber: string): void;
    
    // Database Methods
    saveToDatabase(): Promise<void>;    
}