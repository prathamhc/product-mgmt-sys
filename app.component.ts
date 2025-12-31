import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    apiUrl = 'http://localhost:8001/api/productcollection';

    products: any[] = [];
    product: any = {};
    editId: string | null = null;

    constructor(private http: HttpClient) {
        this.loadProducts();
    }

    // READ
    loadProducts() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: res => this.products = res,
            error: err => console.error(err)
        });
    }

    // CREATE + UPDATE
    saveProduct() {

        const { pro_code, pro_name, pro_category, price } = this.product;

        if (!pro_code || !pro_name || !pro_category || price === '' || price === null) {
            alert('All fields are mandatory');
            return;
        }

        const payload = {
            pro_code,
            pro_name,
            pro_category,
            price: Number(price)
        };

        const request = this.editId
            ? this.http.put(`${this.apiUrl}/${this.editId}`, payload)
            : this.http.post(this.apiUrl, payload);

        request.subscribe({
            next: () => {
                this.resetForm();
                this.loadProducts();
            },
            error: err => alert(err.error?.message || 'Operation failed')
        });
    }

    // EDIT
    editProduct(p: any) {
        this.product = { ...p };
        this.editId = p._id;
    }

    // DELETE
    deleteProduct(id: string) {
        if (!confirm('Are you sure you want to delete?')) return;

        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
            next: () => this.loadProducts(),
            error: err => console.error(err)
        });
    }

    // RESET
    resetForm() {
        this.product = {};
        this.editId = null;
    }
}
