import {AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {SelectOptionComponent} from '../select-option/select-option.component';

@Component({
  selector: 'block-select',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements AfterContentInit {
  @Input() value: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() multiple: boolean = false;
  @Input() noResultsText: string = 'No matching options found';

  @Output() optionsSelected: EventEmitter<SelectOptionComponent[]> = new EventEmitter<SelectOptionComponent[]>();
  private _selectedOptions: SelectOptionComponent[] = [];

  @ContentChildren(SelectOptionComponent) options!: QueryList<SelectOptionComponent>;

  protected isOpen: boolean = false;
  protected filterText: string = '';
  protected filteredOptions: SelectOptionComponent[] = [];

  ngAfterContentInit() {
    this.options.forEach(option => {
      option.optionSelected.subscribe((value: string) => {
        this.selectOption(value);
      });
    });

    this.filteredOptions = this.options.toArray();
  }

  selectOption(value: string) {
    this.options.forEach(option => {
      if (this.multiple) {
        if (option.value === value) {
          option.selected = !option.selected;
          if (option.selected) {
            this._selectedOptions.push(option);
          } else {
            const index = this._selectedOptions.indexOf(option);
            if (index > -1) {
              this._selectedOptions.splice(index, 1);
            }
          }
        }
      } else {
        option.selected = (option.value === value);
        if (option.selected) {
          this._selectedOptions = [option];
          this.isOpen = false;
        }
      }
    });
    this.value = "";
    this._selectedOptions.forEach((option) => {
      this.value += option.label + (this.multiple ? ', ' : '');
    });
    if (this.multiple && this.value.length > 0) {
      this.value = this.value.slice(0, -2);
    }

    this.optionsSelected.emit([...this._selectedOptions]);
  }

  protected toggleOptionsDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterText = "";
      this.filterOptions();
    }
  }

  protected onInputChange(event: any): void {
    this.filterText = event.target.value;
    if (!this.isOpen) this.isOpen = true;

    this.filterOptions();
  }

  protected onInputClick(): void {
    this.isOpen = true;
    this.filterText = "";
    this.value = "";
    this.filterOptions();
  }

  private filterOptions(): void {
    if (this.filterText.trim() === "") {
      this.filteredOptions = this.options.toArray();
    } else {
      const searchText = this.filterText.toLowerCase();
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(searchText) ||
        option.value.toLowerCase().includes(searchText)
      );
    }
  }
}
