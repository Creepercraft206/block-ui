import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { render } from 'katex';

@Component({
  selector: 'block-math',
  imports: [],
  templateUrl: './math.component.html',
  styleUrl: './math.component.css'
})
export class MathComponent implements AfterViewInit, OnChanges {

  // The expression to render in KaTeX format. See https://katex.org/docs/supported for supported syntax.
  @Input({ required: true }) expression: string = '';

  @ViewChild('container', { static: false }) containerRef!: ElementRef;

  private isViewInitialized = false;

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.renderMath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expression'] && this.isViewInitialized) {
      this.renderMath();
    }
  }

  private renderMath(): void {
    const el = this.containerRef?.nativeElement;
    if (el) {
      el.innerHTML = ''; // Clear raw input if any
      try {
        render(this.expression, el, {
          throwOnError: false,
        });
        // remove .katex-html element to avoid unwanted styles
        const katexHtml = el.querySelector('.katex-html');
        if (katexHtml) {
          katexHtml.style.display = "none";
        }
      } catch (e) {
        el.innerText = 'Invalid KaTeX expression';
      }
    }
  }

}
