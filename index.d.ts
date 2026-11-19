export type TwoutWarning =
  | {
      /** The class has a variant twout can't compile, so no CSS was generated for it. */
      type: "unsupported-variant";
      className: string;
      variant: string;
      message: string;
    }
  | {
      /** The class's selector puts :focus, :focus-within or :focus-visible inside :has(). Its CSS is still generated. */
      type: "focus-inside-has";
      className: string;
      selector: string;
      message: string;
    };

export interface TwoutOptions {
  /** Receives each warning instead of it being printed with console.warn. */
  onWarning?: (warning: TwoutWarning) => void;
}

declare function Twout(classes: string[], options?: TwoutOptions): string;
export default Twout;
