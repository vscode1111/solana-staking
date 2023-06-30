const DECIMAL_FACTOR = 1e9;

export function printValue(value?: number | string) {
  if (value === undefined || Number.isNaN(value)) {
    return "";
  }
  return (Number(value ?? 0) / DECIMAL_FACTOR).toFixed(5);
}

export function printSol(value?: number | string) {
  if (value === undefined || Number.isNaN(value)) {
    return "";
  }
  return `${printValue(value)} SOL`;
}
