const DECIMAL_FACTOR = 1e9;

export function printSol(value: number | string) {
  return (Number(value ?? 0) / DECIMAL_FACTOR).toFixed(5);
}
