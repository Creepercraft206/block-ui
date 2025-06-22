import {Component, EventEmitter, Input, OnInit} from '@angular/core';

@Component({
  selector: 'block-modal-header',
  imports: [],
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.css'
})
export class ModalHeaderComponent implements OnInit{

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
