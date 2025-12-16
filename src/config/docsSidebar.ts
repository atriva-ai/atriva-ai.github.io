export const docsSidebar = [
  {
    label: "Getting Started",
    items: [
      { label: "Quick Start", link: "/docs/quickstart" },
      { label: "Onboarding", link: "/docs/onboarding" },
      { label: "Contribution Guide", link: "/docs/contribution" },
      { label: "Beginner Issues", link: "/docs/beginner-issues" },
    ],
  },
  {
    label: "Architecture",
    items: [
      { label: "System Architecture", link: "/docs/architecture" },
      { label: "OpenVINO Architecture", link: "/docs/ai-inference/openvino/architecture" },
      { label: "FFMPEG x86 Architecture", link: "/docs/video-pipeline/ffmpeg-x86/architecture" }
    ],
  },
  {
    label: "Frontend",
    items: [
      { label: "Overview", link: "/docs/frontend" },
    ],
  },
  {
    label: "Atriva Core API",
    items: [
      { label: "Core API", link: "/docs/core-api" },
      { label: "Analytics", link: "/docs/core-api/analytics" },
      { label: "Alerts", link: "/docs/core-api/alerts" },
    ],
  },
  {
    label: "AI Inference",
    items: [
      {
        label: "OpenVINO",
        items: [
          { label: "Overview", link: "/docs/ai-inference/openvino" },
          { label: "Installation",
            collapsed: false,
            items: [
              { label: "Overview", link: "/docs/ai-inference/openvino/installation" },
              { label: "Docker Environment", link: "/docs/ai-inference/openvino/installation/docker-env" },
              { label: "Python Environment", link: "/docs/ai-inference/openvino/installation/python-env"}
            ]
          },
          {
            label: "Development",
            collapsed: false,
            items: [
              {
                label: "Overview",
                link: "/docs/ai-inference/openvino/development",
              },
              {
                label: "API Endpoints",
                link: "/docs/ai-inference/openvino/development/api-endpoints",
              },
              {
                label: "Pure Python Runtime",
                link: "/docs/ai-inference/openvino/development/pure-python",
              },
            ],
          },
          { 
            label: "Models", 
            collapsed: false,
            items: [
              { label: "Overview", link: "/docs/ai-inference/openvino/models" },
              { label: "Model Preparation", link: "/docs/ai-inference/openvino/models/preparation" },
            ]
          },
          { 
            label: "Testing",
            collapsed: false,
            items: [
              { label: "Overview", link: "/docs/ai-inference/openvino/testing" },
              { label: "Troubleshooting", link: "/docs/ai-inference/openvino/testing/troubleshooting" },
            ]
          },
        ],
      },
    ],
  },
  {
    label: "Video Pipeline API",
    items: [
      { label: "Overview", link: "/docs/video-pipeline" },
      {
        label: "FFMPEG x86",
        items: [
          { label: "Overview", link: "/docs/video-pipeline/ffmpeg-x86" },
          {
            label: "Installation",
            items: [
              {
                label: "Overview", link: "/docs/video-pipeline/ffmpeg-x86/installation",
              }
            ],
          },
          { 
            label: "Development",
            items: [
              { label: "Overview", link: "/docs/video-pipeline/ffmpeg-x86/development" },
            ]
          },
          { 
            label: "Integration",
            items: [
              { label: "Overview", link: "/docs/video-pipeline/ffmpeg-x86/integration" },
            ]
          },
          { 
            label: "Testing",
            items: [
              { label: "Overview", link: "/docs/video-pipeline/ffmpeg-x86/testing" },
            ]
          },
        ],
      },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Overview", link: "/docs/community" },
      { label: "How to Contribute", link: "/docs/community/how-to-contribute" },
      { label: "Join Discord", link: "/docs/community/joining-discord" },
    ],
  },
];
