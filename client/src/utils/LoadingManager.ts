export class LoadingManager {
  private loadingScreen: HTMLElement | null;
  private loadingText: HTMLElement | null;
  private loadingBar: HTMLElement | null;
  private progress: number = 0;

  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.loadingText = document.getElementById("loading-text");
    this.loadingBar = document.getElementById("loading-bar");
  }

  /**
   * Show the loading screen
   */
  public showLoadingScreen(): void {
    if (this.loadingScreen) {
      this.loadingScreen.style.display = "flex";
      this.loadingScreen.style.opacity = "1";
    }
  }

  /**
   * Hide the loading screen
   */
  public hideLoadingScreen(): void {
    if (this.loadingScreen) {
      this.loadingScreen.style.opacity = "0";

      // Wait for fade out animation to complete before hiding
      setTimeout(() => {
        if (this.loadingScreen) {
          this.loadingScreen.style.display = "none";
        }
      }, 1000);
    }
  }

  /**
   * Update loading progress
   * @param progress Value between 0 and 1
   */
  public updateProgress(progress: number, message?: string): void {
    this.progress = Math.min(1, Math.max(0, progress));

    if (this.loadingBar) {
      this.loadingBar.style.width = `${this.progress * 100}%`;
    }

    if (message && this.loadingText) {
      this.loadingText.textContent = message;
    }
  }

  /**
   * Show an error message in the loading screen
   */
  public showLoadingError(errorMessage: string): void {
    if (this.loadingText) {
      this.loadingText.textContent = errorMessage;
      this.loadingText.style.color = "red";
    }

    if (this.loadingBar) {
      this.loadingBar.style.backgroundColor = "red";
    }
  }
}
