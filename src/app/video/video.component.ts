import {AfterViewInit, Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'block-video',
  imports: [
    NgIf
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements AfterViewInit {
  @Input({ required: true }) videoUrl: string = '';
  @Input() autoPlay: boolean = false;
  @Input() controls: boolean = true;
  @Input() loop: boolean = false;

  protected videoElement: HTMLVideoElement | null = null;

  protected isPlaying: boolean = false;
  protected isMuted: boolean = false;
  protected isFullScreen: boolean = false;
  protected volume: number = 100;
  protected time: string = '0:00 / 0:00';
  protected progress: number = 0;

  public ngAfterViewInit(): void {
    this.videoElement = document.querySelector('video');
    this.time = this.getVideoTime();
    if (this.autoPlay) {
      if (this.videoElement) {
        this.videoElement.addEventListener('loadeddata', () => {
          setTimeout(() => {
            this.togglePlay();
          }, 1000);
        });
      }
    }

    document.addEventListener('keydown', async (event: KeyboardEvent) => {
      if (event.key === 'f') {
        await this.toggleFullScreen();
      } else if (event.key === ' ') {
        event.preventDefault();
        this.togglePlay();
      } else if (event.key === 'm') {
        this.toggleMute();
      } else if (event.key === 'ArrowUp') {
        if (this.videoElement && document.activeElement === this.videoElement) {
          event.preventDefault();
          this.volume = Math.min(this.volume + 10, 100);
          this.videoElement.volume = this.volume / 100;
        }
      } else if (event.key === 'ArrowDown') {
        if (this.videoElement && document.activeElement === this.videoElement) {
          event.preventDefault();
          this.volume = Math.max(this.volume - 10, 0);
          this.videoElement.volume = this.volume / 100;
        }
      } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && document.activeElement === this.videoElement) {
        if (this.videoElement) {
          const currentTime = this.videoElement.currentTime;
          const duration = this.videoElement.duration;
          if (event.key === 'ArrowLeft') {
            this.videoElement.currentTime = Math.max(currentTime - 5, 0);
          } else if (event.key === 'ArrowRight') {
            this.videoElement.currentTime = Math.min(currentTime + 5, duration);
          }
          this.update();
        }
      }
    });
  }

  protected togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    if (this.videoElement) {
      if (this.isPlaying) {
        this.videoElement.play();
      } else {
        this.videoElement.pause();
      }
      this.mouseMove(new MouseEvent('mousemove'));
    }
  }

  protected toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.videoElement) {
      if (this.isMuted) {
        this.videoElement.muted = true;
        this.videoElement.volume = 0;
      } else {
        this.videoElement.muted = false;
        this.videoElement.volume = this.volume;
      }
    }
  }

  async toggleFullScreen(): Promise<void> {
    this.isFullScreen = !this.isFullScreen;
    const videoElement = document.querySelector('.video-wrapper');
    if (this.isFullScreen) {
      if (videoElement) {
        await videoElement.requestFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        document.body.style.cursor = 'default';
      }
    }
  }

  protected setVolume(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);
    this.volume = value;
    if (this.videoElement) {
      if (value === 0 && !this.isMuted) {
        this.isMuted = true;
        this.videoElement.muted = true;
      } else if (value > 0 && this.isMuted) {
        this.isMuted = false;
        this.videoElement.muted = false;
        this.videoElement.volume = value / 100;
      }
    }
  }

  protected getVideoTime(): string {
    if (this.videoElement) {
      const currentTime = this.videoElement.currentTime;
      const duration = this.videoElement.duration;
      if (isNaN(duration) || duration === 0) {
        return '0:00 / 0:00';
      }
      return `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
    }
    return '0:00 / 0:00';
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  protected setProgress(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);
    if (this.videoElement) {
      this.videoElement.currentTime = (value / 100) * this.videoElement.duration;
    }
    this.update();
  }

  private getProgress(): number {
    if (this.videoElement && this.videoElement.duration > 0) {
      return (this.videoElement.currentTime / this.videoElement.duration) * 100;
    }
    return 0;
  }

  protected update(): void {
    if (this.videoElement) {
      this.time = this.getVideoTime();
      this.isPlaying = !this.videoElement.paused;
      this.isMuted = this.videoElement.muted;
      this.volume = Math.round(this.videoElement.volume * 100);
      this.progress = this.getProgress();

      const progress = document.querySelector(".progress") as HTMLDivElement;
      if (progress) {
        progress.style.width = `${this.progress}%`;
      }
    }
  }


  protected lastMouseX: number = 0;
  protected lastMouseY: number = 0;
  protected mouseMove(event: MouseEvent): void {
    if (this.videoElement) {
      const overlay = document.querySelector('.video-overlay') as HTMLDivElement;
      if (overlay) {
        overlay.style.opacity = '1';
      }
      document.body.style.cursor = 'default';
      if (!this.isPlaying) return;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      setTimeout(() => {
        if (this.lastMouseX === event.clientX && this.lastMouseY === event.clientY) {
          if (overlay) {
            overlay.style.opacity = '0';
          }
          if (document.fullscreenEnabled && this.isFullScreen) {
            document.body.style.cursor = 'none';
          }
        }
      }, 1500);
    }
  }
}
