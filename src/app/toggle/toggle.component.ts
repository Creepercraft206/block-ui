import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'block-toggle',
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css'
})
export class ToggleComponent {
  @Input() label: string | HTMLElement = '';

  @Output() onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected switchState(event: any): void {
    this.onToggle.emit(event.target.checked);
  }
}
