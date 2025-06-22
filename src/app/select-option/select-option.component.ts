import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'block-select-option',
  imports: [],
  templateUrl: './select-option.component.html',
  styleUrl: './select-option.component.css'
})
export class SelectOptionComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() selected: boolean = false;

  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();

  selectOption() {
    this.optionSelected.emit(this.value);
  }

}
