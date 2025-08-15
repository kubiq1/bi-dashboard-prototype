// Temporary script to help update all projects
// This adds the normalized usage and storage structure

const projects = [
  "frontline-si",
  "making-more-health", 
  "guides-boehringer-ingelheim-com",
  "bvdzero-es",
  "vetmedica-research-platform",
  "respiratory-solutions-hub",
  "diabetes-care-portal",
  "oncology-research-net",
  "animal-nutrition-guide",
  "immunology-insights",
  "companion-animal-wellness",
  "clinical-trials-dashboard",
  "veterinary-diagnostic-tools",
  "patient-support-program",
  "livestock-health-monitor",
  "biosimilars-knowledge-base",
  "equine-care-solutions",
  "rare-disease-registry",
  "poultry-health-tracker",
  "pharmaceutical-pipeline",
  "veterinary-education-hub",
  "medical-affairs-portal",
  "swine-production-optimizer",
  "therapeutic-area-insights",
  "companion-diagnostics",
  "regulatory-submission-tracker",
  "farm-animal-welfare",
  "drug-safety-surveillance",
  "aquaculture-health-solutions",
  "personalized-medicine-platform",
  "veterinary-practice-management",
  "clinical-data-exchange",
  "pet-health-monitoring",
  "biopharmaceutical-research",
  "livestock-breeding-optimizer",
  "therapeutic-protein-tracker",
  "animal-vaccine-registry",
  "precision-dosing-calculator",
  "zoo-animal-care-system",
  "molecular-diagnostics-hub",
  "wildlife-health-tracker",
  "drug-interaction-checker",
  "veterinary-telemedicine",
  "biosecurity-monitoring"
];

// Helper to generate random data or null
const randomDataOrNull = () => Math.random() > 0.3;
const randomHits = () => Math.floor(Math.random() * 900000) + 100000;
const randomPct = () => parseFloat((Math.random() * 20 + 1).toFixed(1));
const randomStorage = () => parseFloat((Math.random() * 50 + 1).toFixed(2));

projects.forEach(name => {
  const hasUsageData = randomDataOrNull();
  const hasStorageData = randomDataOrNull();
  
  console.log(`Add to ${name}:`);
  console.log(`usage: {`);
  console.log(`  hits: ${hasUsageData ? randomHits() : null},`);
  console.log(`  hitsPct: ${hasUsageData ? randomPct() : null}`);
  console.log(`},`);
  console.log(`storage: {`);
  console.log(`  dbGb: ${hasStorageData ? randomStorage() : null},`);
  console.log(`  filesGb: ${hasStorageData ? randomStorage() : null},`);
  console.log(`  solrGb: ${hasStorageData ? randomStorage() : null},`);
  console.log(`  totalGb: ${hasStorageData ? (randomStorage() * 3).toFixed(2) : null},`);
  console.log(`  storagePct: ${hasStorageData ? randomPct() : null}`);
  console.log(`},`);
  console.log(`estimatedCost: "USD XXX",`);
  console.log(`monthTotalCost: "USD 12,390"`);
  console.log(`---`);
});
