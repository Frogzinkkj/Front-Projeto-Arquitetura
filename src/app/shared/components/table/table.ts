import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class TableComponent {

  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading = false;

  @Output() editar = new EventEmitter<number>();
  @Output() inativar = new EventEmitter<number>();
}