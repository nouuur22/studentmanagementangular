// It should look EXACTLY like this:
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
  switch(status?.toUpperCase()) {
    case 'ACTIVE': return 'badge bg-success';
    case 'COMPLETED': return 'badge bg-secondary';
    case 'DROPPED': return 'badge bg-danger';
    default: return 'badge bg-light';
  }
}
}
