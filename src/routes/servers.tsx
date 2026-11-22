import { createFileRoute } from "@tanstack/react-router";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Check, ChevronLeft, ChevronRight, Cpu, Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { AppScreen } from "@/components/gram/AppScreen";
import { UserHeader } from "@/components/gram/UserHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useMining } from "@/hooks/use-mining";
import { SERVERS, serverSessionReward } from "@/lib/mining";
import { serverImages } from "@/lib/server-images";
import { serverPurchaseTx, shortAddress } from "@/lib/payments";

export const Route = createFileRoute("/servers")({
  head: () => ({ meta: [
    { title: "Servers — GEMSTON Miner" },
    { name: "description", content: "GEMSTON mining servers from 1 TON. Buy a server as an alternative to withdrawal referrals." },
    { property: "og:title", content: "Servers — GEMSTON Miner" },
    { property: "og:description", content: "Choose your mining server and pay from your connected TON wallet." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ServersPage,
});

function ServersPage() {
  const { state, recordPurchase } = useMining();
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => tonConnectUI.onModalStateChange((modal) => setModalOpen(modal.status === "opened")), [tonConnectUI]);
  const selected = SERVERS.find((s) => s.id === selectedId);
  const owned = (id: string) => state.serverPurchases.some((p) => p.serverId === id);

  const buy = async () => {
    if (!selected || busy || owned(selected.id)) return;
    setError(null);
    if (!address) {
      setModalOpen(true);
      try { await tonConnectUI.openModal(); } catch { setModalOpen(false); setError("Could not open your wallet. Please try again."); }
      return;
    }
    setBusy(true);
    try {
      const result = await tonConnectUI.sendTransaction(serverPurchaseTx(selected.id));
      if (!result.boc) throw new Error("Wallet did not return a transaction");
      recordPurchase(selected.id, result.boc);
      setSubmitted(true);
    } catch {
      setError("Purchase not completed. Your wallet may have cancelled the transaction. Try again when ready.");
    } finally { setBusy(false); }
  };

  return <AppScreen>
    <UserHeader balance={state.coins} />
    <header className="page-heading" data-enter>
      <div className="flex items-center justify-between gap-3"><h1 className="text-4xl font-extrabold">Servers</h1><Cpu className="h-7 w-7 text-peach" /></div>
      <p className="mt-2 text-sm text-muted-foreground">90 rigs · from 1 TON</p>
    </header>
    <div className="mt-5 flex items-center justify-between border-y border-border py-4">
      <div><p className="text-xs text-muted-foreground">MY SERVERS</p><p className="text-2xl font-extrabold">{state.serverPurchases.length}</p></div>
      <div className="text-right"><p className="text-xs text-muted-foreground">EXTRA / 2H SESSION</p><p className="font-bold text-peach">+{serverSessionReward(state)} GEMSTON</p></div>
    </div>
    <div className="server-grid mt-5 grid" data-enter>
      {SERVERS.slice(page * 9, page * 9 + 9).map((server) => <article key={server.id} className="server-card overflow-hidden rounded-lg border border-border bg-card">
        <img src={serverImages[server.imageIndex]?.url} alt={server.name} className="aspect-square w-full object-cover" loading="lazy" />
        <div className="p-3">
          <h2 className="font-bold">{server.name}</h2>
          <p className="mt-1 text-xs text-success">+{server.sessionReward} GEMSTON / 2h</p>
          <p className="server-price mt-3">{server.priceTon} TON</p>
          <Button className="mt-3 w-full" variant={owned(server.id) ? "secondary" : "default"} disabled={owned(server.id)} onClick={() => { setSelectedId(server.id); setSubmitted(false); setError(null); }}>
            {owned(server.id) ? <><Check /> Submitted</> : <><Wallet /> Buy</>}
          </Button>
        </div>
      </article>)}
    </div>
    <div className="mt-5 flex items-center justify-between">
      <Button variant="outline" size="icon" aria-label="Previous servers" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft /></Button>
      <span className="text-sm text-muted-foreground">{page + 1} / 10</span>
      <Button variant="outline" size="icon" aria-label="Next servers" disabled={page === 9} onClick={() => setPage((p) => p + 1)}><ChevronRight /></Button>
    </div>
    <p className="mt-5 text-xs text-muted-foreground">Purchases saved locally, not verified. Real payouts unavailable; rewards are not guaranteed returns.</p>
    <Dialog open={selected != null && !modalOpen} onOpenChange={(open) => { if (!open && !busy) setSelectedId(null); }}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm overflow-y-auto" onInteractOutside={(event) => { if (busy) event.preventDefault(); }}>
        <DialogTitle>{submitted ? "Transaction submitted" : selected?.name}</DialogTitle>
        <DialogDescription>{submitted ? "Saved on this device. Blockchain confirmation and real payouts are not available yet." : "Approve the server purchase in your TON wallet."}</DialogDescription>
        {selected && <>
          <img src={serverImages[selected.imageIndex]?.url} alt={selected.name} className="mx-auto aspect-square w-40 rounded-lg object-cover" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Price</dt><dd className="font-bold">{selected.priceTon} TON</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Extra per session</dt><dd className="font-bold">{selected.sessionReward} GEMSTON</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Wallet</dt><dd>{address ? shortAddress(address) : "Not connected"}</dd></div>
          </dl>
          <p className="text-xs text-muted-foreground">This replaces referrals only, not the withdrawal fee. Your wallet may charge an additional network fee.</p>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {submitted ? <Button onClick={() => setSelectedId(null)}><Check /> Done</Button> : <Button disabled={busy} onClick={buy}>{busy ? <Loader2 className="animate-spin" /> : <Wallet />}{busy ? "Waiting for wallet…" : address ? `Pay ${selected.priceTon} TON` : "Connect wallet"}</Button>}
        </>}
      </DialogContent>
    </Dialog>
  </AppScreen>;
}