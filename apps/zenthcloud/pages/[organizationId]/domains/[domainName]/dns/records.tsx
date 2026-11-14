import { ArrowClockwiseIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useState } from "react";
import { OrganizationProvider } from "@/components/panel/organization-context";
import { organizationPath } from "@/components/panel/navigation";
import { PanelShell } from "@/components/panel/panel-shell";
import { ShowDnsRecords } from "@/components/dashboard/settings/dns/show-dns-records";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getOrganizationPageProps,
	type OrganizationPageProps,
} from "@/lib/organization-page";
import { api } from "@/utils/api";

type DomainDnsRecordsPageProps = OrganizationPageProps & {
	domainName: string;
};

function normalizeDomainName(name: string) {
	return name.toLowerCase().replace(/\.$/, "");
}

export default function DomainDnsRecordsPage({
	organization,
	user,
	domainName,
}: DomainDnsRecordsPageProps) {
	const [selectedProviderId, setSelectedProviderId] = useState("");
	const [selectedZoneId, setSelectedZoneId] = useState("");
	const {
		data: providers,
		isPending: providersPending,
		isError: providersError,
		error: providerError,
		refetch: refetchProviders,
	} = api.dnsProvider.all.useQuery();
	const providerId = providers?.some(
		(provider) => provider.dnsProviderId === selectedProviderId,
	)
		? selectedProviderId
		: (providers?.[0]?.dnsProviderId ?? "");
	const selectedProvider = providers?.find(
		(provider) => provider.dnsProviderId === providerId,
	);
	const {
		data: zones,
		isPending: zonesPending,
		isError: zonesError,
		error: zoneError,
		refetch: refetchZones,
	} = api.dnsProvider.listZones.useQuery(
		{ dnsProviderId: providerId },
		{ enabled: Boolean(providerId) },
	);
	const domainZone = zones?.find(
		(zone) =>
			normalizeDomainName(zone.name) === normalizeDomainName(domainName),
	);
	const activeZone =
		zones?.find((zone) => zone.id === selectedZoneId) ??
		domainZone ??
		(zones?.length === 1 ? zones[0] : undefined);

	return (
		<>
			<Head>
				<title>
					{`DNS Records | ${domainName} | ${organization.name} | ZenthCloud`}
				</title>
			</Head>
			<OrganizationProvider organization={organization}>
				<PanelShell
					title={`DNS · ${domainName}`}
					domainName={domainName}
					user={user}
				>
					<div className="space-y-6">
						<header className="space-y-4">
							<NextLink
								href={organizationPath(
									organization.id,
									`domains/${domainName}`,
								)}
								className="inline-flex items-center gap-2 text-xs text-[#71717A] transition-colors hover:text-[#18181B]"
							>
								<ArrowLeftIcon aria-hidden className="size-4" />
								Retour à {domainName}
							</NextLink>
							<div>
								<h1 className="text-xl font-semibold tracking-tight text-[#18181B]">
									Enregistrements DNS
								</h1>
								<p className="mt-1 max-w-2xl text-sm leading-5 text-[#52525B]">
									Gérez les enregistrements utilisés par ZenthCloud pour
									résoudre et acheminer le trafic de {domainName}.
								</p>
							</div>
						</header>

						<section
							aria-labelledby="dns-zone-heading"
							className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-5"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
								<div className="min-w-0">
									<h2
										id="dns-zone-heading"
										className="text-sm font-semibold text-[#18181B]"
									>
										Zone DNS
									</h2>
									<p className="mt-1 text-xs leading-4 text-[#71717A]">
										Sélectionnez le fournisseur et la zone à modifier.
									</p>
								</div>

								{providers?.length ? (
									<div className="grid gap-3 sm:grid-cols-2 sm:min-w-[420px]">
										<div className="min-w-0">
											<label
												htmlFor="dns-provider"
												className="mb-1.5 block text-xs font-medium text-[#52525B]"
											>
												Fournisseur
											</label>
											<Select
												value={providerId}
												onValueChange={(value) => {
													setSelectedProviderId(value);
													setSelectedZoneId("");
												}}
												disabled={providers.length === 1}
											>
												<SelectTrigger
													id="dns-provider"
													className="h-9 w-full text-sm"
												>
													<SelectValue placeholder="Choisir un fournisseur" />
												</SelectTrigger>
												<SelectContent>
													{providers.map((provider) => (
														<SelectItem
															key={provider.dnsProviderId}
															value={provider.dnsProviderId}
														>
															{provider.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="min-w-0">
											<label
												htmlFor="dns-zone"
												className="mb-1.5 block text-xs font-medium text-[#52525B]"
											>
												Zone
											</label>
											<Select
												value={activeZone?.id ?? ""}
												onValueChange={setSelectedZoneId}
												disabled={zonesPending || !zones?.length}
											>
												<SelectTrigger
													id="dns-zone"
													className="h-9 w-full text-sm"
												>
													<SelectValue
														placeholder={
															zonesPending
																? "Chargement des zones…"
																: "Choisir une zone"
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{zones?.map((zone) => (
														<SelectItem key={zone.id} value={zone.id}>
															{zone.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								) : null}
							</div>

							{providersPending && (
								<div
									role="status"
									className="mt-4 h-10 animate-pulse rounded-md bg-[#F3F4F6]"
								>
									<span className="sr-only">
										Chargement des fournisseurs DNS
									</span>
								</div>
							)}

							{providersError && (
								<div
									role="alert"
									className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-xs text-[#991B1B]"
								>
									<span>
										Impossible de charger les fournisseurs DNS :{" "}
										{providerError.message}
									</span>
									<button
										type="button"
										onClick={() => void refetchProviders()}
										className="inline-flex items-center gap-1 font-medium underline underline-offset-2"
									>
										<ArrowClockwiseIcon aria-hidden className="size-3.5" />
										Réessayer
									</button>
								</div>
							)}

							{!providersPending && !providersError && !providers?.length && (
								<p className="mt-4 rounded-md border border-dashed border-[#D1D5DB] px-4 py-6 text-center text-sm text-[#52525B]">
									Aucun fournisseur DNS n’est configuré pour cette organisation.
								</p>
							)}

							{zonesError && (
								<div
									role="alert"
									className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-xs text-[#991B1B]"
								>
									<span>
										Impossible de charger les zones : {zoneError.message}
									</span>
									<button
										type="button"
										onClick={() => void refetchZones()}
										className="inline-flex items-center gap-1 font-medium underline underline-offset-2"
									>
										<ArrowClockwiseIcon aria-hidden className="size-3.5" />
										Réessayer
									</button>
								</div>
							)}

							{!zonesPending && !zonesError && providerId && !zones?.length && (
								<p className="mt-4 rounded-md border border-dashed border-[#D1D5DB] px-4 py-6 text-center text-sm text-[#52525B]">
									Aucune zone n’est disponible pour{" "}
									{selectedProvider?.name ?? "ce fournisseur"}.
								</p>
							)}
						</section>

						{providers?.length && activeZone && providerId ? (
							<ShowDnsRecords
								dnsProviderId={providerId}
								zoneId={activeZone.id}
							/>
						) : null}
					</div>
				</PanelShell>
			</OrganizationProvider>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DomainDnsRecordsPageProps
> = async (context) => {
	const result = await getOrganizationPageProps(context);
	if (!("props" in result)) return result;

	const rawDomain = context.params?.domainName;
	const domainName = Array.isArray(rawDomain) ? rawDomain[0] : rawDomain;
	if (!domainName) return { notFound: true };

	const props = await result.props;
	return { props: { ...props, domainName } };
};
