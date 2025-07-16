import {Component, EventEmitter} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FileInputComponent} from './file-input/file-input.component';
import {ModalComponent} from './modal/modal.component';
import {ModalHeaderComponent} from './modal-header/modal-header.component';
import {ModalContentComponent} from './modal-content/modal-content.component';
import {ToggleComponent} from './toggle/toggle.component';
import {SelectComponent} from './select/select.component';
import {SelectOptionComponent} from './select-option/select-option.component';
import {VideoComponent} from './video/video.component';
import {MathComponent} from './math/math.component';

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
