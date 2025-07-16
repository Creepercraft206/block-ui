import {Component, EventEmitter} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FileInputComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalContentComponent,
  ToggleComponent,
  SelectComponent,
  SelectOptionComponent,
  VideoComponent,
  MathComponent
} from 'blockui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FileInputComponent, ModalComponent, ModalHeaderComponent, ModalContentComponent, ToggleComponent, SelectComponent, SelectOptionComponent, VideoComponent, MathComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'block-ui';
  fileName: string = "";

  modalOpenState: EventEmitter<boolean> = new EventEmitter<boolean>();

  switchState: string = "Toggle is OFF";

  selectedOptions: string[] = [];

  expression: string = 'c = \\pm\\sqrt{a^2 + b^2}';

  setSwitchState(state: boolean): void {
    if (state) {
      this.switchState = "Toggle is ON";
    } else {
      this.switchState = "Toggle is OFF";
    }
  }

  openModal(): void {
    this.modalOpenState.emit(true);
  }

  setFileName(files: File[]): void {
    if (files && files.length > 0) {
      this.fileName = files.map(f => f.name).join(', ');
    } else {
      this.fileName = '';
    }
  }

  getSelectedOptions(options: SelectOptionComponent[]): void {
    this.selectedOptions = options.map(option => option.label);
  }

  updateExpression(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.expression = target.value;
  }
}
