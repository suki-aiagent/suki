export const mockData = {
  profile: {
    name: "Suki",
    title: "AWS Cloud Engineer & DevOps Engineer",
    intro:
      "AWS + DevOps engineer with 3 years at TCS (Bengaluru). I build reliable, secure cloud platforms on AWS with automation-first mindset — Terraform IaC, Jenkins CI/CD, containerization, Linux, and solid networking.",
    location: "Bengaluru, India",
    resumeUrl: "https://example.com/suki-resume.pdf",
    email: "suki.cloud.dev@example.com",
    socials: {
      linkedin: "https://www.linkedin.com/in/suki-aws-devops",
      github: "https://github.com/suki-devops",
      instagram: "https://instagram.com/suki_cloud",
      x: "https://x.com/suki_cloud"
    }
  },
  skills: {
    primary: [
      "AWS EC2",
      "AWS VPC",
      "AWS IAM",
      "AWS S3",
      "AWS RDS",
      "Jenkins CI/CD",
      "Terraform",
      "Linux",
      "Bash",
      "Networking"
    ],
    secondary: [
      "Docker",
      "Kubernetes",
      "Git/GitHub",
      "Maven",
      "Nginx"
    ]
  },
  certifications: [
    {
      name: "AWS Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      validTill: "Apr 2027"
    },
    {
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      validTill: "Apr 2027"
    }
  ],
  experience: [
    {
      company: "Tata Consultancy Services (TCS)",
      role: "AWS & DevOps Engineer",
      period: "Jun 2022 — Present",
      summary:
        "Delivering and operating AWS infrastructure at scale: automated provisioning with Terraform, CI/CD with Jenkins, secure VPC/IAM designs, and observability.",
      highlights: [
        "Provisioned multi-account AWS environments with Terraform modules",
        "Designed VPC networking (subnets, IGW/NAT, route tables, NACLs)",
        "Built secure IAM roles/policies for least-privilege access",
        "Automated blue/green deployments using Jenkins pipelines",
        "Optimized EC2 and RDS spend via right-sizing and scheduling",
        "Hardened Linux AMIs and implemented patching automation"
      ]
    }
  ],
  projects: [
    {
      name: "AWS Landing Zone with Terraform",
      description:
        "Modular Terraform stack to bootstrap AWS org: accounts, VPCs, IAM, S3, CloudTrail, and baseline guardrails.",
      tags: ["Terraform", "AWS Organizations", "Security"],
      link: "#"
    },
    {
      name: "Jenkins CI/CD for Microservices",
      description:
        "Declarative pipelines building Docker images, scanning, and deploying to Kubernetes with progressive delivery.",
      tags: ["Jenkins", "Docker", "Kubernetes"],
      link: "#"
    },
    {
      name: "Nginx as Edge Gateway",
      description:
        "Reverse proxy with TLS, rate limiting, and caching for multi-service ingress.",
      tags: ["Nginx", "Security", "Performance"],
      link: "#"
    }
  ]
};