export interface ITwoDayPackage {
    FlatFee: number;
    ShippingMethod: string;
    calculateCost(): number;
    saveToDatabase(): Promise<void>;
  }