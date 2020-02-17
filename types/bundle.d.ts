/// <reference types="react" />
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps
    }
  }
}

export interface ModelViewerProps extends React.HTMLAttributes<HTMLElement> {
  model: string,
  hdri?: string,
  modeltitle?: string,
  author?: string,
  authorlink?: string,
  resizable?: boolean,
  autohide?: boolean,
  skycolor?: string,
  groundcolor?: string
}
