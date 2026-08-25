"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Step = "auth" | "payment" | "success" | "failed";
type Phase = "idle" | "processing" | "threeDS";

type PaymentMethodId = "card" | "bancontact" | "paypal" | "bank-transfer";

interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  brands?: string[];
  disabled?: boolean;
}

interface OrderSummary {
  orderId: string;
  product: string;
  specs: string[];
  subtotal: number;
  tax: number;
  total: number;
}

const paymentMethods: PaymentMethod[] = [
  { id: "card", label: "Carte", brands: ["Visa", "Mastercard"] },
  { id: "bancontact", label: "Bancontact" },
  { id: "paypal", label: "PayPal", disabled: true },
  { id: "bank-transfer", label: "Virement", disabled: true },
];

const countries = ["France", "Belgique", "Allemagne", "Luxembourg", "Suisse", "Autre"];

const order: OrderSummary = {
  orderId: "ZC-2026-000001",
  product: "ZenthCloud VPS",
  specs: ["4 vCPU", "8 GB RAM", "100 GB NVMe", "Debian 13", "Belgium"],
  subtotal: 21,
  tax: 4.41,
  total: 25.41,
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);

function CheckoutHeader() {
  return (
    <header className="mx-auto flex w-full max-w-md items-center justify-between">
      <span className="text-lg font-semibold tracking-tight text-foreground">ZenthCloud</span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        Paiement sécurisé
      </span>
    </header>
  );
}

function CheckoutFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
      <a href="#" className="hover:text-foreground">
        Conditions d&apos;utilisation
      </a>
      <a href="#" className="hover:text-foreground">
        Confidentialité
      </a>
      <a href="#" className="hover:text-foreground">
        Aide
      </a>
    </footer>
  );
}

function OrderSummary({ summary }: { summary: OrderSummary }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-muted">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </span>
          <span>
            <span className="block text-sm font-medium text-foreground">{summary.product}</span>
            <span className="block text-xs text-muted-foreground">
              {formatPrice(summary.total)} · Quantité 1
            </span>
          </span>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">{summary.specs.join(" · ")}</p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Sous-total</dt>
              <dd className="text-foreground">{formatPrice(summary.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">TVA</dt>
              <dd className="text-foreground">{formatPrice(summary.tax)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

function AuthenticationStep({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState<"lookup" | "login" | "register">("lookup");
  const [submitting, setSubmitting] = React.useState(false);

  const emailId = React.useId();
  const passwordId = React.useId();
  const nameId = React.useId();

  function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    setMode("login");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(onAuthenticated, 800);
  }

  return (
    <div className="space-y-4">
      {mode === "lookup" && (
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={emailId}>Adresse e-mail</Label>
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Continuer
          </Button>
        </form>
      )}

      {mode === "login" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={emailId}>Adresse e-mail</Label>
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={passwordId}>Mot de passe</Label>
            <Input
              id={passwordId}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Se connecter et continuer
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Nouveau client ?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="font-medium text-primary hover:underline"
            >
              Créer un compte
            </button>
          </p>
        </form>
      )}

      {mode === "register" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={nameId}>Nom complet</Label>
            <Input id={nameId} type="text" autoComplete="name" required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={emailId}>Adresse e-mail</Label>
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={passwordId}>Mot de passe</Label>
            <Input
              id={passwordId}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Créer mon compte et continuer
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

function PaymentMethodTabs({
  value,
  onChange,
}: {
  value: PaymentMethodId;
  onChange: (id: PaymentMethodId) => void;
}) {
  return (
    <div role="tablist" aria-label="Moyen de paiement" className="flex flex-wrap gap-1">
      {paymentMethods.map((method) => {
        const selected = value === method.id;
        const Icon =
          method.id === "card" ? CreditCard : method.id === "bank-transfer" ? Landmark : Wallet;
        return (
          <button
            key={method.id}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={method.disabled}
            onClick={() => onChange(method.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40",
              method.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Icon className="h-4 w-4" />
            {method.label}
          </button>
        );
      })}
    </div>
  );
}

function CardElement() {
  const numberId = React.useId();
  const expiryId = React.useId();
  const cvcId = React.useId();

  const [number, setNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }

  return (
    <div className="rounded-lg border border-input shadow-xs transition-[box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
      <div className="flex items-center gap-3 border-b border-input px-3 py-3">
        <Input
          id={numberId}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 1234 1234 1234"
          value={number}
          onChange={(e) => setNumber(formatCardNumber(e.target.value))}
          className="h-auto border-0 p-0 font-mono shadow-none focus-visible:ring-0 focus-visible:border-0"
        />
        <span className="flex shrink-0 items-center gap-1">
          {["Visa", "Mastercard"].map((brand) => (
            <span
              key={brand}
              className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
            >
              {brand}
            </span>
          ))}
        </span>
      </div>

      <div className="grid grid-cols-2">
        <div className="px-3 py-3">
          <Input
            id={expiryId}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            className="h-auto border-0 p-0 font-mono shadow-none focus-visible:ring-0 focus-visible:border-0"
          />
        </div>
        <div className="border-l border-input px-3 py-3">
          <Input
            id={cvcId}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="h-auto border-0 p-0 font-mono shadow-none focus-visible:ring-0 focus-visible:border-0"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentButton({
  amount,
  phase,
  disabled,
  onClick,
}: {
  amount: number;
  phase: Phase;
  disabled?: boolean;
  onClick: () => void;
}) {
  const label =
    phase === "idle"
      ? `Payer ${formatPrice(amount)}`
      : phase === "processing"
        ? "Traitement du paiement…"
        : "Authentification bancaire…";

  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      disabled={disabled || phase !== "idle"}
      onClick={onClick}
    >
      {phase !== "idle" && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

function PaymentSection({
  authenticated,
  onAuthenticated,
  onPaid,
  onFailed,
}: {
  authenticated: boolean;
  onAuthenticated: () => void;
  onPaid: () => void;
  onFailed: () => void;
}) {
  const [method, setMethod] = React.useState<PaymentMethodId>("card");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const nameId = React.useId();
  const countryId = React.useId();

  function handlePay() {
    setPhase("processing");
    setTimeout(() => setPhase("threeDS"), 1500);
    setTimeout(() => {
      onPaid();
    }, 3000);
  }

  if (!authenticated) {
    return <AuthenticationStep onAuthenticated={onAuthenticated} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Moyen de paiement</h2>
        <button
          type="button"
          onClick={onAuthenticated}
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <Mail className="mr-1 inline h-3.5 w-3.5" />
          Changer de compte
        </button>
      </div>

      <PaymentMethodTabs value={method} onChange={setMethod} />

      {method === "card" && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Informations de carte</Label>
            <CardElement />
          </div>

          <div className="space-y-2">
            <Label htmlFor={nameId}>Nom sur la carte</Label>
            <Input
              id={nameId}
              type="text"
              autoComplete="cc-name"
              placeholder="Jean Dupont"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={countryId}>Pays ou région</Label>
            <select
              id={countryId}
              className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
              defaultValue="France"
            >
              {countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <PaymentButton amount={order.total} phase={phase} onClick={handlePay} />

      <div className="flex items-start justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>Vos informations de paiement sont traitées de manière sécurisée par notre prestataire.</p>
      </div>
    </div>
  );
}

function SuccessView({ orderId }: { orderId: string }) {
  return (
    <div role="status" className="mx-auto w-full max-w-md py-10 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
        <Check className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Paiement confirmé</h1>
      <p className="mt-2 text-muted-foreground">Votre paiement a bien été effectué.</p>
      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-xs text-muted-foreground">Commande</p>
        <p className="mt-1 font-mono text-sm font-semibold text-foreground">{orderId}</p>
        <p className="mt-4 text-sm text-muted-foreground">Nous préparons maintenant votre service.</p>
      </div>
      <Button asChild className="mt-8 w-full" size="lg">
        <a href="https://manager.zenthcloud.com">Accéder à mon espace ZenthCloud</a>
      </Button>
    </div>
  );
}

function FailureView({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="mx-auto w-full max-w-md py-10 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <ShieldCheck className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
        Impossible de finaliser le paiement
      </h1>
      <p className="mt-2 text-muted-foreground">
        Votre banque ou votre moyen de paiement a refusé la transaction.
      </p>
      <Button onClick={onRetry} className="mt-8 w-full" size="lg">
        Réessayer
      </Button>
    </div>
  );
}

export default function Page() {
  const [step, setStep] = React.useState<Step>("auth");

  return (
    <main className="flex min-h-screen flex-col bg-background px-6 py-4 sm:px-8 sm:py-6">
      <CheckoutHeader />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
        {step === "success" ? (
          <SuccessView orderId={order.orderId} />
        ) : step === "failed" ? (
          <FailureView onRetry={() => setStep("payment")} />
        ) : (
          <>
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Finaliser votre commande
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Payer <span className="font-medium text-foreground">ZenthCloud</span> ·{" "}
              <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
            </p>

            <div className="mt-5">
              <OrderSummary summary={order} />
            </div>

            <div className="mt-6">
              <PaymentSection
                authenticated={step === "payment"}
                onAuthenticated={() => setStep("payment")}
                onPaid={() => setStep("success")}
                onFailed={() => setStep("failed")}
              />
            </div>
          </>
        )}
      </div>

      <CheckoutFooter />
    </main>
  );
}
