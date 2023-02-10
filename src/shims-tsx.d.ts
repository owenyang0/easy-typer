import Vue, { VNode } from 'vue'

type CSSOMString = string;
type FontFaceLoadStatus = 'unloaded'|'loading'|'loaded'|'error';
type FontFaceSetStatus = 'loading'|'loaded';

interface FontFace {
  family: CSSOMString;
  style: CSSOMString;
  weight: CSSOMString;
  stretch: CSSOMString;
  unicodeRange: CSSOMString;
  variant: CSSOMString;
  featureSettings: CSSOMString;
  variationSettings: CSSOMString;
  display: CSSOMString;
  readonly status: FontFaceLoadStatus;
  readonly loaded: Promise<FontFace>;
  load(): Promise<FontFace>;
}

interface FontFaceSet {
  readonly status: FontFaceSetStatus;
  readonly ready: Promise<FontFaceSet>;
  check(font: string, text?: string): boolean;
  load(font: string, text?: string): Promise<FontFace[]>;
}

declare global {
  interface Document {
    fonts: FontFaceSet;
  }
  interface Window {
    electronAPI: {
      handlePaste: any;
      removePasteHanlder: any;
      setGrade: (val: string) => void;
      getAppVersion: any;
    };
    __typer: {
      env: string;
    };
  }
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
