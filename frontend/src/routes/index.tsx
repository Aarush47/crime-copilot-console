import { createFileRoute } from "@tanstack/react-router";
import { IconRail } from "@/components/copilot/IconRail";
import { TopBar } from "@/components/copilot/TopBar";
import { MapCanvas } from "@/components/copilot/MapCanvas";
import { LeftPanel } from "@/components/copilot/LeftPanel";
import { CaseDrawer } from "@/components/copilot/CaseDrawer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[var(--color-bg-0)]">
      <MapCanvas />
      <IconRail />
      <TopBar />
      <LeftPanel />
      <CaseDrawer />
    </div>
  );
}
