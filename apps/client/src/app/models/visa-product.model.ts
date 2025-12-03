export enum EntryType {
  SINGLE = 'Single',
  MULTIPLE = 'Multiple',
}

export interface VisaProduct {
  id: string;
  country: string;
  visaType: string;
  price: number;
  lengthOfStay: number;
  numberOfEntries: EntryType;
  filingFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisaProduct {
  country: string;
  visaType: string;
  price: number;
  lengthOfStay: number;
  numberOfEntries: EntryType;
  filingFee: number;
}

export interface VisaProductsResponse {
  data: VisaProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  country?: string;
  visaType?: string;
  minPrice?: number;
  maxPrice?: number;
  numberOfEntries?: EntryType;
}

