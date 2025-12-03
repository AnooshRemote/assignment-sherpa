# Visa Products API - Implementation Approach

## Overview

This document outlines the approach, architectural decisions, and trade-offs made while building the visa products API and frontend application for the sherpa° coding challenge.

## Focus Areas

### 1. Production-Ready API Design
- **RESTful API** with proper HTTP methods and status codes
- **Input validation** using class-validator DTOs
- **Error handling** with appropriate HTTP status codes
- **Pagination and filtering** for efficient data retrieval
- **CORS configuration** for frontend integration

### 2. Advanced Feature: Currency Conversion
- **Real-time exchange rates** via ExchangeRate-API
- **Caching strategy** (1-hour TTL) to minimize API calls
- **Graceful degradation** with stale cache fallback
- **Error handling** for API failures

### 3. Modern Frontend Experience
- **Angular standalone components** for modern architecture
- **Reactive forms** with comprehensive validation
- **Responsive design** for mobile and desktop
- **Real-time currency conversion** in the UI
- **Intuitive filtering and pagination**

## Architecture Decisions

### Backend (NestJS)

#### Data Storage
- **Decision**: In-memory storage with seeded CSV data
- **Rationale**: 
  - Simplifies setup and deployment
  - Sufficient for demonstration purposes
  - Easy to migrate to a database later
- **Trade-off**: Data is lost on server restart (acceptable for this challenge)

#### Module Structure
```
visa-products/
  ├── dto/           # Data Transfer Objects with validation
  ├── entities/      # Domain models
  ├── visa-products.service.ts
  ├── visa-products.controller.ts
  └── visa-products.module.ts
```
- **Decision**: Feature-based module organization
- **Rationale**: 
  - Clear separation of concerns
  - Easy to scale and maintain
  - Follows NestJS best practices

#### Validation Strategy
- **Decision**: Class-validator with DTOs
- **Rationale**:
  - Type-safe validation
  - Automatic error messages
  - Clean separation of validation logic

#### Currency Conversion
- **Decision**: Separate currency module with caching
- **Rationale**:
  - Reusable across the application
  - Isolated error handling
  - Easy to swap exchange rate providers

### Frontend (Angular)

#### Component Architecture
- **Decision**: Standalone components with lazy loading
- **Rationale**:
  - Modern Angular approach
  - Better tree-shaking
  - Easier to maintain

#### State Management
- **Decision**: Service-based state with RxJS
- **Rationale**:
  - Sufficient for this application size
  - No need for NgRx complexity
  - Direct API communication

#### Form Handling
- **Decision**: Reactive forms with custom validators
- **Rationale**:
  - Better type safety
  - More control over validation
  - Better user experience

## Key Features Implemented

### Core Requirements ✅
1. **Browse all visa products** with pagination and filtering
2. **View individual product details**
3. **Edit product information**
4. **Create new products**

### Advanced Features ✅
1. **Currency conversion** with real-time exchange rates
2. **Caching** for exchange rates (1-hour TTL)
3. **Error handling** for external API failures
4. **Graceful degradation** with cached rates

### Additional Enhancements
1. **Delete functionality** for products
2. **Comprehensive filtering** (country, visa type, price range, entries)
3. **Responsive design** for mobile devices
4. **Loading states** and error messages
5. **Form validation** with user-friendly error messages

## API Endpoints

### Visa Products
- `GET /api/visa-products` - List products with pagination and filtering
- `GET /api/visa-products/:id` - Get product by ID
- `POST /api/visa-products` - Create new product
- `PATCH /api/visa-products/:id` - Update product
- `DELETE /api/visa-products/:id` - Delete product

### Currency
- `GET /api/currency/convert?amount=100&from=USD&to=EUR` - Convert currency
- `GET /api/currency/supported` - Get supported currencies

## Query Parameters for Product List

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `country` - Filter by country (partial match)
- `visaType` - Filter by visa type (partial match)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `numberOfEntries` - Filter by entry type (Single/Multiple)

## Scaling Considerations

### With More Users/Data

1. **Database Migration**
   - Replace in-memory storage with PostgreSQL
   - Add database indexes for filtered fields (country, visaType, price)
   - Implement connection pooling

2. **Caching Layer**
   - Add Redis for exchange rate caching (distributed cache)
   - Cache frequently accessed products
   - Implement cache invalidation strategies

3. **Performance Optimization**
   - Add database query optimization
   - Implement API response caching
   - Add pagination limits (max items per page)

4. **Monitoring & Logging**
   - Add structured logging (Winston/Pino)
   - Implement request/response logging
   - Add performance metrics (response times, error rates)
   - Set up health check endpoints

5. **Error Handling**
   - Implement retry logic for external APIs
   - Add circuit breakers for external services
   - Better error tracking (Sentry, Datadog)

6. **Security**
   - Add authentication/authorization
   - Implement rate limiting
   - Add input sanitization
   - CORS configuration for production

7. **Testing**
   - Unit tests for services
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Load testing for performance

## What I'd Improve Given More Time

1. **Testing**
   - Comprehensive unit tests (target: 80%+ coverage)
   - Integration tests for API endpoints
   - E2E tests with Cypress/Playwright

2. **Database Integration**
   - Migrate to PostgreSQL with TypeORM/Prisma
   - Add database migrations
   - Implement soft deletes

3. **Enhanced Features**
   - Search functionality (full-text search)
   - Sorting options (by price, country, etc.)
   - Bulk operations (import/export)
   - Product categories/tags

4. **UI/UX Improvements**
   - Loading skeletons instead of text
   - Toast notifications for actions
   - Confirmation dialogs with better UX
   - Keyboard shortcuts
   - Advanced filtering UI

5. **Performance**
   - Implement virtual scrolling for large lists
   - Add request debouncing for filters
   - Optimize bundle size
   - Add service worker for offline support

6. **Documentation**
   - API documentation with Swagger/OpenAPI
   - Component documentation
   - Setup and deployment guides

7. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support
   - Color contrast improvements

## Technology Choices

### Backend
- **NestJS**: Modern, scalable Node.js framework
- **class-validator**: Type-safe validation
- **axios**: HTTP client for external APIs

### Frontend
- **Angular 19**: Latest Angular with standalone components
- **RxJS**: Reactive programming for API calls
- **Reactive Forms**: Type-safe form handling

### Currency API
- **ExchangeRate-API**: Free tier, reliable, no API key required for basic usage

## Trade-offs Made

1. **In-memory storage vs Database**
   - Chose in-memory for simplicity
   - Easy to migrate later

2. **No authentication**
   - Out of scope per requirements
   - Would add JWT/auth in production

3. **Basic error handling**
   - Functional but could be more comprehensive
   - Would add structured error responses

4. **No tests**
   - Focused on feature completeness
   - Would add comprehensive test suite

5. **Simple caching**
   - In-memory cache sufficient for demo
   - Would use Redis in production

## Conclusion

This implementation demonstrates:
- **Production-ready API design** with proper validation and error handling
- **Modern frontend architecture** with Angular standalone components
- **Advanced features** like currency conversion with caching
- **Clean code structure** that's maintainable and scalable
- **User-friendly interface** with responsive design

The codebase is structured to easily accommodate future enhancements like database integration, authentication, and comprehensive testing.

