import { Injectable } from '@angular/core';
import { Product } from './models/product.model';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private products: Product[] = []; // Array to hold product data
    private categories: string[] = ['Top Sales', 'New Arrivals', 'Hot Sales']; // Predefined categories
    private apiUrl: string = 'http://localhost:3000'; // Add this line

    constructor(private http: HttpClient) { 
        this.products = [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1727973835323-10e4171a5848?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        caption: 'Hot Sale Product 1',
        price: 99.99,
        description: 'This is a fantastic product on hot sale!',
        rating: 4.5,
        reviews: ['Amazing product! Worth every penny. I would buy this again!'],
        category: 'Hot Sales'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1728049803398-42260c68e9fd?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        caption: 'New Arrival Product 1',
        price: 59.99,
        description: 'Check out this new arrival!',
        rating: 4.0,
        reviews: ['Just got it, love it!', 'Great quality for the price.'],
        category: 'New Arrivals'
      },
      {
        id: 3,
        image: 'https://media.istockphoto.com/id/171353053/photo/confident-african-american-female-executive-isolated.jpg?s=2048x2048&w=is&k=20&c=8wTS846dySOMBhOd2sfaiiissiLY81O8QRyyjzNj7Is=',
        caption: 'Top Sale Product 1',
        price: 29.99,
        description: 'Top-selling product in our store.',
        rating: 5.0,
        reviews: ['Best purchase ever!', 'Highly recommend this product!'],
        category: 'Top Sales'
      }
    ];
  }

  // Method to get all products
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  // Method to get a product by ID
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(product => product.id === id);
    return of(product);
  }

  // Method to get all categories
  getCategories(): string[] {
    return this.categories;
  }

  // Method to add a new product
  addProduct(product: Product): Observable<Product> {
    const productToInsert = {
      _id: uuidv4(),  // Generate a unique ID
      ...product,
      id: undefined  // Remove the original 'id' field if it exists
    };

    return this.http.post<Product>(`${this.apiUrl}/products`, productToInsert).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.message) {
          return throwError(() => new Error(error.error.message));
        }
        return throwError(() => new Error('An unknown error occurred'));
      })
    );
  }

  // Method to update an existing product
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);

  // Method to create a product
  
}

}