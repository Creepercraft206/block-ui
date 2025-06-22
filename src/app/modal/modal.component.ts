import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'block-modal',
  imports: [
    NgIf
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {

  @Input() openState: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected isOpen: boolean = false;

  ngOnInit() {
    this.openState.subscribe((isOpen: boolean) => {
      this.isOpen = isOpen;
    });
  }

  close(): void {
    this.isOpen = false;
    this.openState.emit(false);
  }
}
