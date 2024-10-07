import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { take } from 'rxjs/operators';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentProduct: Product = this.getEmptyProduct();
  categories: string[] = ['New Arrival', 'Hot Sales', 'New Trend'];
  selectedCategory: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = []; // Add this line
  newProduct: Product = {
    id: 0,
    image: '',
    caption: '',
    price: 0,
    description: '',
    rating: 0,
    reviews: [],
    category: ''
  };

  constructor(private productService: ProductService,private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().pipe(take(1)).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filterProducts();
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  filterProducts(): void {
    if (this.selectedCategory) {
      this.filteredProducts = this.products.filter(p => p.category === this.selectedCategory);
    } else {
      this.filteredProducts = this.products;
    }
  }

  onSubmit(): void {
    if (this.currentProduct.id) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct(): void {
    this.productService.addProduct(this.currentProduct).subscribe({
      next: (newProduct: Product) => {
        this.products.push(newProduct);
        this.filterProducts();
      },
      error: (error: any) => {
        console.error('Error adding product:', error);
      }
    });
  }

  updateProduct(): void {
    this.productService.updateProduct(this.currentProduct).pipe(
      tap(() => {
        // Handle successful update
        this.products = this.products.map(p => 
          p.id === this.currentProduct.id ? this.currentProduct : p
        );
        this.currentProduct = this.getEmptyProduct(); // Reset the form
      }),
      catchError(error => {
        // Handle error
        console.error('Error updating product', error);
        return of(null); // Return an observable
      })
    ).subscribe();
  }

  editProduct(product: Product): void {
    this.currentProduct = { ...product };
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).pipe(
      tap(() => {
        this.products = this.products.filter(p => p.id !== id);
        this.filterProducts();
      })
    ).subscribe({
      next: () => {
        // Product deleted successfully
      },
      error: (error: any) => {
        console.error('Error deleting product:', error);
      }
    });
  }

  // Add this method
  private getEmptyProduct(): Product {
    return {
      id: 0,
      price: 0,
      // Add other properties as needed
    } as Product;
  }
  resetNewProduct() {
    this.newProduct = {
      id: 0,
      image: '',
      caption: '',
      price: 0,
      description: '',
      rating: 0,
      reviews: [],
      category: ''
    };

}

}