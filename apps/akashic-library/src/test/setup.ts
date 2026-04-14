type DevGlobal = typeof globalThis & {
  __DEV__: boolean;
};

(globalThis as DevGlobal).__DEV__ = true;
