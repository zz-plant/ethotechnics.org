import diagnosticExportKitJson from "./bundles/diagnostic-export-kit.json";
import procurementClausePackJson from "./bundles/procurement-clause-pack.json";

export type BundleExportFormat = "GitHub" | "Notion" | "PDF";
export type BundleExportStatus = "available" | "coming-soon";

export type BundleExportOption = {
  format: BundleExportFormat;
  status: BundleExportStatus;
  description: string;
  href?: string;
  ctaLabel?: string;
};

export type BundleArtifact = {
  title: string;
  detail: string;
};

export type BundleMetadata = {
  slug: string;
  title: string;
  summary: string;
  scope: string;
  includedArtifacts: BundleArtifact[];
  useCases: string[];
  updateCadence: string;
  exports: BundleExportOption[];
};

const procurementClausePack = procurementClausePackJson as BundleMetadata;
const diagnosticExportKit = diagnosticExportKitJson as BundleMetadata;

export const bundleIndex: BundleMetadata[] = [procurementClausePack, diagnosticExportKit];

export const getBundle = (slug: string) =>
  bundleIndex.find((bundle) => bundle.slug === slug);
