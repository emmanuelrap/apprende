let _version = 0;

export function signalHomeRefresh() {
  _version++;
}

export function consumeHomeRefreshSignal(): number {
  const v = _version;
  _version = 0;
  return v;
}
