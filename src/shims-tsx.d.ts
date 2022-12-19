import Vue, { VNode } from 'vue'

declare global {
  interface Window {
    electronAPI: {
      handlePaste: any;
      setGrade: (val: string) => void;
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
