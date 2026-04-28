import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private readonly stream = new Subject<ToastMessage>();
  private nextId = 1;

  readonly messages$ = this.stream.asObservable();

  show(text: string, type: ToastType = 'info') {
    this.stream.next({ id: this.nextId++, text, type });
  }

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error');
  }

  info(text: string) {
    this.show(text, 'info');
  }
}
