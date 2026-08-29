import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Brain,
  Cloud,
  Container,
  Database,
  Globe,
  HardDrive,
  Network,
  Phone,
  Server,
  ShieldCheck,
} from "lucide-react";

/**
 * Catalogue des services proposés à la commande.
 *
 * Source unique utilisée par la sidebar (dialog « Ajouter un service ») et la
 * Vue d'ensemble (dialog « Créer une ressource »). À remplacer par un appel
 * API (routers/api/v1) une fois le backend connecté.
 */
export interface CatalogService {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export interface CatalogGroup {
  label: string;
  services: CatalogService[];
}

export const allServices: CatalogGroup[] = [
  {
    label: "Bare Metal Cloud",
    services: [
      {
        label: "Serveurs dédiés",
        description: "Serveurs physiques dédiés",
        icon: Server,
        href: "/order/check-in",
      },
      {
        label: "Serveurs Privés Virtuels",
        description: "VPS élastiques à la demande",
        icon: HardDrive,
        href: "/order/check-in",
      },
      {
        label: "Managed Bare Metal",
        description: "VMware managé en haute disponibilité",
        icon: Container,
        href: "/order/check-in",
      },
      {
        label: "NAS-HA",
        description: "Stockage réseau haute disponibilité",
        icon: Archive,
        href: "/order/check-in",
      },
    ],
  },
  {
    label: "Cloud computing",
    services: [
      {
        label: "Compute",
        description: "Instances cloud à la demande",
        icon: Cloud,
        href: "/order/check-in",
      },
      {
        label: "Kubernetes",
        description: "Conteneurs managés",
        icon: Container,
        href: "/order/check-in",
      },
      {
        label: "Databases",
        description: "Bases de données managées",
        icon: Database,
        href: "/order/check-in",
      },
      {
        label: "Object Storage",
        description: "Stockage d'objets élastique",
        icon: Archive,
        href: "/order/check-in",
      },
      {
        label: "GPU & IA",
        description: "Serveurs GPU pour l'IA",
        icon: Brain,
        href: "/order/check-in",
      },
    ],
  },
  {
    label: "Autres services",
    services: [
      {
        label: "Network",
        description: "Réseau privé et pare-feu",
        icon: Network,
        href: "/order/check-in",
      },
      {
        label: "IAM & Sécurité",
        description: "Identités et accès",
        icon: ShieldCheck,
        href: "/order/check-in",
      },
      { label: "Télécom", description: "Téléphonie et SDA", icon: Phone, href: "/order/check-in" },
      {
        label: "Web Cloud",
        description: "Hébergement web et e-mail",
        icon: Globe,
        href: "/order/check-in",
      },
    ],
  },
];
