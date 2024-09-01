export declare global {
    interface Window {
        fbaAsyncInit: () => any;
    }
    interface Document {
        getElementById(id: string): HTMLElement | null;
    }
}