// src/app/components/shared/delete-button/delete-button.component.ts

// Import necessary Angular core modules
import { Component, EventEmitter, Input, Output } from '@angular/core';
// Import CommonModule for common Angular directives
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-button', // HTML tag to use this component
  standalone: true, // Marks this as a standalone component
  imports: [CommonModule], // Import CommonModule for basic directives
  templateUrl: './delete-button.component.html', // Path to the component's HTML template
  styleUrls: ['./delete-button.component.css'] // Path to the component's CSS styles
})
export class DeleteButtonComponent {
  // Input property: customizable text for the delete button
  @Input() buttonText = 'Delete';
  // Input property: optional name of the item to be deleted (used in confirmation message)
  @Input() itemName?: string;
  // Input property: disable state for the button
  @Input() disabled = false;
  // Output property: event emitter that fires when delete is confirmed
  @Output() delete = new EventEmitter<void>();

  // Method called when the delete button is clicked
  onClick() {

    // If itemName is provided, use a specific message with the item name

    const message = this.itemName
      ? `Are you sure you want to delete "${this.itemName}"?`
      : 'Are you sure?';

    // Show confirmation dialog to the user
    if (confirm(message)) {
      // If user confirms, emit the delete event
      // Parent component can listen to this event and handle the actual deletion
      this.delete.emit();
    }
  }
}
