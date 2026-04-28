import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent implements OnInit, OnDestroy {

  toasts: ToastMessage[] = [];
  private sub?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.messages$.subscribe((toast) => {
      this.toasts = [...this.toasts, toast];
      setTimeout(() => this.dismiss(toast.id), 3400);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }
}
