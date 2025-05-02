export interface IOneDayPackage {
    FlatFee: number;
    ShippingMethod: string;
    calculateCost(): number;
    saveToDatabase(): Promise<void>;
  }