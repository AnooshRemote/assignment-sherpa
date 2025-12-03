import { EntryType } from '../dto/create-visa-product.dto';

export class VisaProduct {
  id: string;
  country: string;
  visaType: string;
  price: number;
  lengthOfStay: number;
  numberOfEntries: EntryType;
  filingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

