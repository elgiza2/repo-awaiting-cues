import { SERVERS, WITHDRAWAL_FEE } from "./mining";

/** Every in-app payment lands on this TON address. */
export const PAYMENT_ADDRESS = "UQAp1QxnLJ2z44IooUovvtVShw7hJBEdxCRV3RlbCYC3D8qj";

export const toNano = (gram: number) => String(Math.round(gram * 1e9));

export const withdrawalFeeTx = () => ({
  validUntil: Math.floor(Date.now() / 1000) + 600,
  messages: [{ address: PAYMENT_ADDRESS, amount: toNano(WITHDRAWAL_FEE) }],
});

export const serverPurchaseTx = (serverId: string) => {
  const server = SERVERS.find((item) => item.id === serverId);
  if (!server) throw new Error("Unknown server");
  return {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{ address: PAYMENT_ADDRESS, amount: toNano(server.priceTon) }],
  };
};

export const shortAddress = (a: string) => (a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-6)}` : a);
