import { Injectable, NotFoundException } from '@nestjs/common';
import { VisaProduct } from './entities/visa-product.entity';
import { CreateVisaProductDto } from './dto/create-visa-product.dto';
import { UpdateVisaProductDto } from './dto/update-visa-product.dto';
import { QueryVisaProductsDto } from './dto/query-visa-products.dto';

@Injectable()
export class VisaProductsService {
  private products: VisaProduct[] = [];
  private nextId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    const csvData = [
      { country: 'USA', visaType: 'Tourist', price: 160, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 20 },
      { country: 'USA', visaType: 'Business', price: 185, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 25 },
      { country: 'USA', visaType: 'Student', price: 350, lengthOfStay: 730, numberOfEntries: 'Multiple', filingFee: 50 },
      { country: 'Canada', visaType: 'Tourist', price: 100, lengthOfStay: 180, numberOfEntries: 'Single', filingFee: 15 },
      { country: 'Canada', visaType: 'Business', price: 150, lengthOfStay: 365, numberOfEntries: 'Multiple', filingFee: 30 },
      { country: 'Canada', visaType: 'Student', price: 200, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 40 },
      { country: 'UK', visaType: 'Tourist', price: 130, lengthOfStay: 180, numberOfEntries: 'Single', filingFee: 25 },
      { country: 'UK', visaType: 'Business', price: 200, lengthOfStay: 365, numberOfEntries: 'Multiple', filingFee: 35 },
      { country: 'UK', visaType: 'Student', price: 450, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 55 },
      { country: 'France', visaType: 'Schengen', price: 80, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 10 },
      { country: 'Germany', visaType: 'Schengen', price: 90, lengthOfStay: 90, numberOfEntries: 'Multiple', filingFee: 12 },
      { country: 'Italy', visaType: 'Schengen', price: 85, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 11 },
      { country: 'Spain', visaType: 'Schengen', price: 88, lengthOfStay: 90, numberOfEntries: 'Multiple', filingFee: 13 },
      { country: 'Australia', visaType: 'Tourist', price: 145, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 18 },
      { country: 'Australia', visaType: 'Business', price: 250, lengthOfStay: 365, numberOfEntries: 'Multiple', filingFee: 40 },
      { country: 'Australia', visaType: 'Student', price: 620, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 60 },
      { country: 'Japan', visaType: 'Tourist', price: 30, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 8 },
      { country: 'Japan', visaType: 'Business', price: 55, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 12 },
      { country: 'Japan', visaType: 'Student', price: 100, lengthOfStay: 730, numberOfEntries: 'Multiple', filingFee: 25 },
      { country: 'China', visaType: 'Tourist', price: 140, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 20 },
      { country: 'China', visaType: 'Business', price: 185, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 30 },
      { country: 'China', visaType: 'Student', price: 250, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 45 },
      { country: 'India', visaType: 'Tourist', price: 25, lengthOfStay: 30, numberOfEntries: 'Single', filingFee: 5 },
      { country: 'India', visaType: 'Business', price: 75, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 10 },
      { country: 'India', visaType: 'Student', price: 100, lengthOfStay: 365, numberOfEntries: 'Multiple', filingFee: 20 },
      { country: 'Brazil', visaType: 'Tourist', price: 40, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 10 },
      { country: 'Brazil', visaType: 'Business', price: 160, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 25 },
      { country: 'Brazil', visaType: 'Student', price: 200, lengthOfStay: 730, numberOfEntries: 'Multiple', filingFee: 35 },
      { country: 'Russia', visaType: 'Tourist', price: 50, lengthOfStay: 30, numberOfEntries: 'Single', filingFee: 15 },
      { country: 'Russia', visaType: 'Business', price: 150, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 25 },
      { country: 'Russia', visaType: 'Student', price: 250, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 40 },
      { country: 'UAE', visaType: 'Tourist', price: 90, lengthOfStay: 30, numberOfEntries: 'Single', filingFee: 10 },
      { country: 'UAE', visaType: 'Business', price: 120, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 15 },
      { country: 'UAE', visaType: 'Student', price: 250, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 35 },
      { country: 'Mexico', visaType: 'Tourist', price: 36, lengthOfStay: 180, numberOfEntries: 'Single', filingFee: 8 },
      { country: 'Mexico', visaType: 'Business', price: 100, lengthOfStay: 365, numberOfEntries: 'Multiple', filingFee: 20 },
      { country: 'Mexico', visaType: 'Student', price: 200, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 30 },
      { country: 'South Africa', visaType: 'Tourist', price: 50, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 12 },
      { country: 'South Africa', visaType: 'Business', price: 125, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 18 },
      { country: 'South Africa', visaType: 'Student', price: 200, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 30 },
      { country: 'Argentina', visaType: 'Tourist', price: 150, lengthOfStay: 90, numberOfEntries: 'Single', filingFee: 15 },
      { country: 'Argentina', visaType: 'Business', price: 180, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 25 },
      { country: 'Argentina', visaType: 'Student', price: 250, lengthOfStay: 1095, numberOfEntries: 'Multiple', filingFee: 35 },
      { country: 'Thailand', visaType: 'Tourist', price: 35, lengthOfStay: 60, numberOfEntries: 'Single', filingFee: 5 },
      { country: 'Thailand', visaType: 'Business', price: 75, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 10 },
      { country: 'Thailand', visaType: 'Student', price: 175, lengthOfStay: 730, numberOfEntries: 'Multiple', filingFee: 25 },
      { country: 'Vietnam', visaType: 'Tourist', price: 25, lengthOfStay: 30, numberOfEntries: 'Single', filingFee: 5 },
      { country: 'Vietnam', visaType: 'Business', price: 50, lengthOfStay: 180, numberOfEntries: 'Multiple', filingFee: 12 },
      { country: 'Vietnam', visaType: 'Student', price: 150, lengthOfStay: 730, numberOfEntries: 'Multiple', filingFee: 20 },
    ];

    csvData.forEach((item) => {
      const product: VisaProduct = {
        id: String(this.nextId++),
        ...item,
        numberOfEntries: item.numberOfEntries as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.products.push(product);
    });
  }

  findAll(query: QueryVisaProductsDto) {
    let filtered = [...this.products];

    // Apply filters
    if (query.country) {
      filtered = filtered.filter((p) =>
        p.country.toLowerCase().includes(query.country.toLowerCase())
      );
    }

    if (query.visaType) {
      filtered = filtered.filter((p) =>
        p.visaType.toLowerCase().includes(query.visaType.toLowerCase())
      );
    }

    if (query.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= query.maxPrice);
    }

    if (query.numberOfEntries) {
      filtered = filtered.filter((p) => p.numberOfEntries === query.numberOfEntries);
    }

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  findOne(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Visa product with ID ${id} not found`);
    }
    return product;
  }

  create(createDto: CreateVisaProductDto) {
    const product: VisaProduct = {
      id: String(this.nextId++),
      ...createDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  update(id: string, updateDto: UpdateVisaProductDto) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Visa product with ID ${id} not found`);
    }

    this.products[index] = {
      ...this.products[index],
      ...updateDto,
      updatedAt: new Date(),
    };

    return this.products[index];
  }

  remove(id: string) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Visa product with ID ${id} not found`);
    }

    const removed = this.products[index];
    this.products.splice(index, 1);
    return removed;
  }
}

