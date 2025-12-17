// Products configuration - Easy to edit product details
// Icons use Boxicons names from astro-icon (prefix: bx:)

export type ProductStatus = "ready" | "coming-soon" | "planning";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  useCaseIcons: string[]; // Boxicons names
  features: string[];
  capabilities: string[];
  apis?: string[]; // Atriva APIs used
  appliedTo?: string[]; // Industries/use cases
  image?: string; // Path to product screenshot/mock
  gif?: string; // Optional looping GIF
  featured?: boolean;
  status: ProductStatus; // ready, coming-soon, or planning
}

export const products: Product[] = [
  {
    id: "retail-analytics",
    name: "Retail Analytics Suite",
    tagline: "Real-time customer insights for smarter retail decisions",
    description:
      "AI-powered retail analytics built for real-world stores. Understand customer flow, optimize layouts, and improve operations using real-time, edge-based insights—without sending video to the cloud.",    
    useCaseIcons: ["bx:bx-store", "bx:bx-user", "bx:bx-line-chart"],
    features: [
      "Real-time foot traffic insights",
      "Customer heatmaps & flow paths",
      "Queue & dwell time optimization",
      "Audience demographic analysis",
    ],
    capabilities: [
      "Multi-camera people tracking",
      "Edge-based demographic inference",
      "Works with existing IP cameras",
      "Privacy-first: no cloud uploads required",
      "Live dashboard & historical reports",
      "DIY or white-label deployment",
    ],
    apis: ["CPU or NPU AI Inference", "Video Pipeline", "Analytics API"],
    appliedTo: ["Retail", "Loss prevention", "In-store analytics"],
    image: "/images/products/retail-analytics.png",
    featured: true,
    status: "ready",
  },
  {
    id: "smart-parking",
    name: "Smart Parking System",
    tagline: "Intelligent parking management with edge AI",
    description: "Automate parking operations with license plate recognition, occupancy tracking, and violation detection. Deploy quickly using existing cameras for real-time, reliable enforcement.",
    useCaseIcons: ["bx:bx-car", "bx:bx-camera", "bx:bx-check-shield"],
    features: [
      "License plate recognition (LPR)",
      "Real-time occupancy tracking",
      "Violation detection & alerts",
      "Automated access control",
    ],
    capabilities: [
      "High-accuracy LPR in real-world conditions",
      "Works with existing IP cameras",
      "Offline-capable operation",
      "Configurable parking rules & zones",
      "Real-time alerts & violation evidence capture",
      "Historical analytics & reporting",
    ],
    apis: ["OpenVINO Inference", "Video Pipeline", "Alerts API"],
    appliedTo: ["Smart parking", "Commercial parking facilities", "Airports & transit hubs", "Smart cities", "Campus & enterprise parking"],
    image: "/images/products/smart-parking.png",
    status: "coming-soon",
  },
  {
    id: "safety-monitor",
    name: "Workplace Safety Monitor",
    tagline: "Smart AI safety for a worry-free workforce",
    description:
      "Improve workplace safety with automated PPE detection, restricted zone monitoring, and incident alerts. Real-time analysis helps enforce compliance without manual oversight.",
    useCaseIcons: ["bx:bx-hard-hat", "bx:bx-shield-alt-2", "bx:bx-bell"],
    features: [
      "Real-time PPE detection",
      "Unsafe behavior recognition",
      "High-risk zone monitoring",
      "Instant safety alerts & logging",
    ],
    capabilities: [
      "Detect helmets, vests, goggles, and safety gear",
      "Virtual e-fence enforcement for restricted or hazardous zones",
      "Real-time alerts for safety incidents",
      "Compliance trend analysis over time",
      "Automated incident logging and compliance reporting",
      "Real-time alerts via on-site broadcast or backend notifications",
    ],
    apis: ["OpenVINO Inference", "Video Pipeline", "Alerts API", "Analytics API"],
    appliedTo: [
      "Construction sites",
      "Manufacturing & factories",
      "Warehouses & logistics centers",
      "Energy & utilities",
      "Worksite entry checkpoints",
    ],
    image: "/images/products/safety-monitor.png",
    featured: true,
    status: "coming-soon",
  },
  {
    id: "entry-alert-system",
    name: "Entry Alert System",
    tagline: "Smart AI notifications that deliver better service",
    description:
      "An AI-powered entry detection and notification system that tracks customer arrivals, guest counts, and wait times in real time, enabling faster service response and improved customer experience.",
    useCaseIcons: ["bx:bx-face", "bx:bx-door-open", "bx:bx-lock-alt"],
    features: [
      "Real-time customer entry detection",
      "Automated wait-time tracking",
      "Tablet alerts for faster service",
      "Entry logs & traffic analytics",
    ],
    capabilities: [
      "Detect customers entering and exiting the premises",
      "Count guests automatically and identify group size",
      "Track entry times and waiting duration in real time",
      "Send instant alerts to kitchen or service staff tablets",
      "Live dashboard view from all connected cameras",
      "Configurable notification rules and thresholds",
    ],
    appliedTo: [
      "Restaurants & cafés",
      "Quick-service restaurants (QSR)",
      "Retail stores",
      "Service counters",
      "Waiting areas & reception zones",
    ],
    status: "coming-soon",
  },
  {
    id: "ai-vision-fall-detection",
    name: "AI Vision Fall Detection",
    tagline: "Zero-blind-spot protection with instant response",
    description:
      "An AI-powered fall detection system that continuously monitors environments using video analytics to detect falls in real time, trigger immediate alerts, and reduce response time without requiring wearable devices.",
    useCaseIcons: [
      "bx:bx-camera",
      "bx:bx-health",
      "bx:bx-alarm",
    ],
    features: [
      "Real-time fall detection alerts",
      "Non-wearable, camera-based monitoring",
      "Instant multi-channel notifications",
      "Edge AI for low-latency response",
    ],
    capabilities: [
      "Detect human falls accurately in real time",
      "Zero blind-spot monitoring with multi-camera coverage",
      "Immediate alerts via messaging apps, email, or loudspeaker",
      "On-device AI processing for privacy and reliability",
      "Configurable alert rules and escalation policies",
      "Supports speaker-triggered emergency announcements",
    ],
    appliedTo: [
      "Home care & assisted living",
      "Nursing homes",
      "Hospitals & healthcare facilities",
      "Public areas & commercial spaces",
      "Gyms & fitness centers",
      "Factories & industrial sites",
      "Construction sites",
      "Cold storage environments",
      "Shopping malls",
      "Kindergartens",
    ],
    status: "coming-soon",
  },
  {
    id: "meal-inspection-system",
    name: "Meal Inspection System",
    tagline: "AI meal checker for zero-mistake orders",
    description:
      "An AI-powered meal inspection solution that verifies food orders, detects anomalies, and ensures correct plating before delivery, helping food service operations eliminate mistakes and improve quality control.",
    useCaseIcons: [
      "bx:bx-dish",
      "bx:bx-check-circle",
      "bx:bx-layout",
    ],
    features: [
      "Automated order verification",
      "Food anomaly detection",
      "Plating & placement checks",
      "Image archiving & reporting",
    ],
    capabilities: [
      "Detect food anomalies such as hair, pests, or foreign objects",
      "Verify ingredients and side dishes against order definitions",
      "Check item placement and plating consistency",
      "Score order accuracy and presentation quality",
      "Instant voice and on-screen alerts for failed inspections",
      "Automatic image capture and audit trail for every meal",
    ],
    appliedTo: [
      "Restaurant kitchens",
      "Quick-service restaurants (QSR)",
      "Central kitchens",
      "Meal delivery operations",
      "Catering services"
    ],
    status: "coming-soon",
  },
  {
    id: "traffic-intelligence",
    name: "Traffic Intelligence Platform",
    tagline: "Smart city traffic optimization at the edge",
    description:
      "Optimize traffic flow with AI-powered vehicle counting, speed estimation, and congestion detection. Real-time insights enable smarter, safer city traffic management.",
    useCaseIcons: ["bx:bx-traffic-cone", "bx:bx-car", "bx:bx-stats"],
    features: [
      "Vehicle counting & classification",
      "Speed estimation",
      "Congestion detection",
      "Incident alerting",
    ],
    capabilities: [
      "Multi-lane vehicle tracking",
      "Vehicle type classification",
      "Real-time speed analytics",
      "Weather-adaptive detection",
      "Integration with traffic signals",
      "Open data export formats",
    ],
    apis: ["OpenVINO Inference", "Video Pipeline", "Analytics API"],
    appliedTo: [
      "Smart cities",
      "Urban traffic management",
      "Highways & arterial roads",
      "Transit authorities",
      "Municipal traffic operations",
    ],
    image: "/images/products/traffic-intelligence.png",
    status: "planning",
  },
  {
    id: "access-control",
    name: "Intelligent Access Control",
    tagline: "Frictionless security with face recognition",
    description:
      "Secure your premises with edge-based face recognition. Fast, accurate, and privacy-compliant access control without relying on the cloud.",
    useCaseIcons: ["bx:bx-face", "bx:bx-door-open", "bx:bx-lock-alt"],
    features: [
      "Face recognition access",
      "Visitor management",
      "Tailgating detection",
      "Access logs & audit trails",
    ],
    capabilities: [
      "Fast, reliable recognition under varying lighting conditions",
      "Tailgating & unauthorized entry detection",
      "On-device face database for privacy",
      "Anti-spoofing protection",
      "Audit logs & compliance reporting",
      "Integrates with existing access control systems",
    ],
    apis: ["OpenVINO Inference", "Video Pipeline", "Core API"],
    appliedTo: [
      "Corporate offices",
      "Campus & enterprise buildings",
      "Healthcare facilities",
      "Industrial & manufacturing sites",
      "Airports & transit hubs",
    ],
    image: "/images/products/access-control.png",
    status: "planning",
  },
];

export const heroContent = {
  title: "Edge AI Solutions",
  subtitle: "Built for Real-World Impact",
  description:
    "We're building AI solutions that solve real problems. Some are ready today, others are coming soon—your feedback helps us prioritize what matters most.",
};

// Helper functions to filter products by status
export const getReadyProducts = () => products.filter(p => p.status === "ready");
export const getComingSoonProducts = () => products.filter(p => p.status === "coming-soon");
export const getPlanningProducts = () => products.filter(p => p.status === "planning");

