export function printJson(value: any) {
  return JSON.stringify(value, null, 2);
}

export async function sleep(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(resolve as any, ms));
}

export function printError(error: any) {
  if ("message" in error) {
    return error.message;
  }

  return error;
}

export function truncateAddres(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
