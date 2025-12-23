// src/app/components/shared/delete-button/delete-button.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.css']
})
export class DeleteButtonComponent {
  @Input() buttonText = 'Delete';
  @Input() itemName?: string;
  @Input() disabled = false;
  @Output() delete = new EventEmitter<void>();

  onClick() {
    const message = this.itemName
      ? `Are you sure you want to delete "${this.itemName}"?`
      : 'Are you sure?';

    if (confirm(message)) {
      this.delete.emit();
    }
  }
}
