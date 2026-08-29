"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { allServices } from "@/lib/mock/services";

export function CreateResourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Créer une ressource"
      description="Choisissez le type de ressource à déployer"
    >
      <CommandInput placeholder="Rechercher une ressource…" />
      <CommandList>
        <CommandEmpty>Aucune ressource trouvée.</CommandEmpty>
        {allServices.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.services.map((service) => {
              const Icon = service.icon;
              return (
                <CommandItem
                  key={service.label}
                  value={service.label}
                  onSelect={() => {
                    onOpenChange(false);
                    router.push(service.href);
                  }}
                >
                  <Icon />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{service.label}</span>
                    <span className="text-xs text-muted-foreground">{service.description}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
