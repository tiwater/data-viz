declare let __webpack_public_path__: string;
declare let __webpack_nonce__: string;

// Check if we are hosting files on cdn and set webpack public path
if (window.public_cdn_path) {
  __webpack_public_path__ = window.public_cdn_path;
}

// This is a path to the public folder without '/build'
window.__grafana_public_path__ =
  __webpack_public_path__.substring(0, __webpack_public_path__.lastIndexOf('build/')) || __webpack_public_path__;

if (window.nonce) {
  __webpack_nonce__ = window.nonce;
}

// This is an indication to the window.onLoad failure check that the app bundle has loaded.
window.__grafana_app_bundle_loaded = true;

import { isInIcestark, setLibraryName } from '@ice/stark-app';
import ReactDOM from 'react-dom';

import app from './app';

// 注意：`setLibraryName` 的入参需要与 webpack 工程配置的 output.library 保持一致
setLibraryName('@ticos/data-viz');

// 集成 ice-stark
// https://micro-frontends.ice.work/docs/guide/use-child/react#%E5%B7%B2%E6%9C%89-react-%E9%A1%B9%E7%9B%AE%E6%94%B9%E9%80%A0%E4%B8%BA%E5%BE%AE%E5%BA%94%E7%94%A8
const mount = (props: { container: HTMLElement | undefined }) => {
  app.init(props.container);
};

const unmount = (props: { container: HTMLElement }) => {
  ReactDOM.unmountComponentAtNode(props.container);
};

if (!isInIcestark()) {
  app.init();
}

export { mount, unmount };
