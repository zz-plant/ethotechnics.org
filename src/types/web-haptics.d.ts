declare module "web-haptics" {
  export class WebHaptics {
    trigger(
      pattern: "nudge" | "success" | "error",
      options?: { intensity?: number },
    ): Promise<void>;
    destroy(): void;
  }
}
