import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'block-file-input',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent implements OnInit {
  @Input() label: string = '';
  @Input() accept: string[] = ['image/*'];
  @Input() multiple: boolean = false;

  @Output() filesSelected = new EventEmitter<File[]>();

  protected selectedFiles: File[] = [];
  protected previewImages: string[] = [];

  ngOnInit() {
    const input = document.querySelector(".custom-file-input input[type='file']") as HTMLInputElement;
    if (input) {
      input.accept = this.accept.join(',');
      input.multiple = this.multiple;
    } else {
      console.error("BlockUI |", "File input not found");
    }
  }

  protected selectFile(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      if (this.multiple) {
        for (let file of event.target.files) {
          if (this.selectedFiles.includes(file)) return;
          if (!this.isAllowedExtension(this.getFileExtension(file))) {
            console.error("BlockUI |", "File type not allowed");
            alert(`Nur Dateien mit den folgenden Erweiterungen sind erlaubt: ${this.getAllowedExtensionsString()}`);
            return;
          }
          this.selectedFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewImages.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      } else {
        if (this.selectedFiles.includes(event.target.files[0])) {
          return;
        }
        else if (this.selectedFiles.length > 0) {
          this.selectedFiles = [];
          this.previewImages = [];
        }
        if (!this.isAllowedExtension(this.getFileExtension(event.target.files[0]))) {
          console.error("BlockUI |", "File type not allowed");
          alert(`Nur Dateien mit den folgenden Erweiterungen sind erlaubt: ${this.getAllowedExtensionsString()}`);
          return;
        }
        this.selectedFiles.push(event.target.files[0]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
      this.filesSelected.emit(this.selectedFiles);
    }
  }

  protected getFileExtension(file: File): string {
    return file.name.split('.').pop() || '';
  }

  protected isAllowedExtension(extension: string): boolean {
    const allowedExtensions = this.getAllowedExtensionsString().split(',').map(ext => ext.trim());
    return allowedExtensions.includes(extension) || false;
  }

  protected getAllowedExtensionsString(): string {
    let extensions: string[] = [];
    if (!this.accept || this.accept.length === 0 || this.accept[0] === '*/*') {
      return '';
    } else if (this.accept[0] === 'image/*') {
      extensions.push('jpg, jpeg, png, gif, svg, webp');
    } else if (this.accept[0] === 'video/*') {
      extensions.push('mp4, webm, ogg');
    } else if (this.accept[0] === 'audio/*') {
      extensions.push('mp3, wav, ogg');
    } else {
      this.accept.forEach((type) => {
        extensions.push(type
          .replace("application/", "")
          .replace("image/", "")
          .replace("audio/", "")
          .replace("video/", "")
          .replace("+xml", "")
        );
      });
    }
    return extensions.join(", ");
  }

  protected removeFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.previewImages.splice(index, 1);
      this.filesSelected.emit(this.selectedFiles);
    } else {
      console.error("BlockUI |", "Invalid file index");
    }
  }
}
