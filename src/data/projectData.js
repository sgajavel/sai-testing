export const TEAM_MEMBERS = [
  { id: 1, name: 'Alex Chen', role: 'Lead Designer', avatar: 'AC', color: '#6366f1' },
  { id: 2, name: 'Jordan Lee', role: 'Frontend Dev', avatar: 'JL', color: '#f59e0b' },
  { id: 3, name: 'Sam Rivera', role: 'Backend Dev', avatar: 'SR', color: '#10b981' },
  { id: 4, name: 'Morgan Kim', role: 'Content Writer', avatar: 'MK', color: '#ef4444' },
  { id: 5, name: 'Taylor Brooks', role: 'Marketing Lead', avatar: 'TB', color: '#8b5cf6' },
  { id: 6, name: 'Casey White', role: 'QA Engineer', avatar: 'CW', color: '#06b6d4' },
];

export const CATEGORIES = ['Design', 'Development', 'Content', 'Marketing', 'Testing', 'Launch'];

export const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed', 'Blocked'];

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export const MILESTONES = [
  { id: 'm1', week: 1, title: 'Project Kickoff', description: 'Team alignment and project plan finalized' },
  { id: 'm2', week: 2, title: 'Design Approved', description: 'Brand identity and wireframes approved by stakeholders' },
  { id: 'm3', week: 4, title: 'Dev Sprint 1 Complete', description: 'Core platform infrastructure ready' },
  { id: 'm4', week: 6, title: 'Content Ready', description: 'All product pages and content finalized' },
  { id: 'm5', week: 7, title: 'Beta Launch', description: 'Internal beta testing begins' },
  { id: 'm6', week: 9, title: 'Soft Launch', description: 'Limited audience launch for final feedback' },
  { id: 'm7', week: 10, title: 'Full Launch', description: 'Official public launch of the e-commerce site' },
];

export const INITIAL_TASKS = [
  // Design
  { id: 1, title: 'Brand Identity & Logo Design', category: 'Design', status: 'Completed', priority: 'Critical', assignee: 1, week: 1, description: 'Create logo, color palette, typography, and brand guidelines.', dueDate: 'Week 1' },
  { id: 2, title: 'UI/UX Wireframes', category: 'Design', status: 'Completed', priority: 'High', assignee: 1, week: 1, description: 'Wireframe all key pages: home, product listing, product detail, cart, checkout.', dueDate: 'Week 1' },
  { id: 3, title: 'High-Fidelity Mockups', category: 'Design', status: 'Completed', priority: 'High', assignee: 1, week: 2, description: 'Create pixel-perfect designs for all pages.', dueDate: 'Week 2' },
  { id: 4, title: 'Design System & Component Library', category: 'Design', status: 'In Progress', priority: 'High', assignee: 1, week: 2, description: 'Build reusable component library with all UI elements.', dueDate: 'Week 2' },
  { id: 5, title: 'Mobile Responsive Designs', category: 'Design', status: 'In Progress', priority: 'Medium', assignee: 1, week: 3, description: 'Adapt all mockups for mobile and tablet viewports.', dueDate: 'Week 3' },
  { id: 6, title: 'Email Template Designs', category: 'Design', status: 'Not Started', priority: 'Medium', assignee: 1, week: 4, description: 'Design transactional and marketing email templates.', dueDate: 'Week 4' },

  // Development
  { id: 7, title: 'Tech Stack Setup & Dev Environment', category: 'Development', status: 'Completed', priority: 'Critical', assignee: 3, week: 1, description: 'Set up repo, CI/CD pipeline, staging and production environments.', dueDate: 'Week 1' },
  { id: 8, title: 'Database Schema Design', category: 'Development', status: 'Completed', priority: 'Critical', assignee: 3, week: 1, description: 'Design and implement database schema for products, users, orders.', dueDate: 'Week 1' },
  { id: 9, title: 'User Authentication System', category: 'Development', status: 'Completed', priority: 'High', assignee: 3, week: 2, description: 'Implement login, registration, password reset, OAuth.', dueDate: 'Week 2' },
  { id: 10, title: 'Product Catalog & Search', category: 'Development', status: 'In Progress', priority: 'Critical', assignee: 2, week: 3, description: 'Build product listing, filtering, search, and detail pages.', dueDate: 'Week 3' },
  { id: 11, title: 'Shopping Cart & Wishlist', category: 'Development', status: 'In Progress', priority: 'High', assignee: 2, week: 3, description: 'Implement add-to-cart, cart management, and wishlist features.', dueDate: 'Week 3' },
  { id: 12, title: 'Payment Gateway Integration', category: 'Development', status: 'Not Started', priority: 'Critical', assignee: 3, week: 4, description: 'Integrate Stripe/PayPal for secure checkout processing.', dueDate: 'Week 4' },
  { id: 13, title: 'Order Management System', category: 'Development', status: 'Not Started', priority: 'High', assignee: 3, week: 5, description: 'Build order tracking, history, and management dashboard.', dueDate: 'Week 5' },
  { id: 14, title: 'Admin Dashboard', category: 'Development', status: 'Not Started', priority: 'High', assignee: 2, week: 5, description: 'Build admin panel for product, order, and user management.', dueDate: 'Week 5' },
  { id: 15, title: 'Performance Optimization', category: 'Development', status: 'Not Started', priority: 'Medium', assignee: 2, week: 8, description: 'Optimize load times, implement CDN, lazy loading, caching.', dueDate: 'Week 8' },
  { id: 16, title: 'SEO Technical Implementation', category: 'Development', status: 'Not Started', priority: 'Medium', assignee: 2, week: 7, description: 'Implement meta tags, sitemap, schema markup, canonical URLs.', dueDate: 'Week 7' },

  // Content
  { id: 17, title: 'Product Copywriting', category: 'Content', status: 'In Progress', priority: 'High', assignee: 4, week: 3, description: 'Write compelling product descriptions for all 200+ products.', dueDate: 'Week 3-5' },
  { id: 18, title: 'Homepage & Landing Page Copy', category: 'Content', status: 'Completed', priority: 'High', assignee: 4, week: 2, description: 'Write hero copy, value propositions, and CTA text.', dueDate: 'Week 2' },
  { id: 19, title: 'About Us & Brand Story', category: 'Content', status: 'Completed', priority: 'Medium', assignee: 4, week: 2, description: 'Write brand story, mission, and team page content.', dueDate: 'Week 2' },
  { id: 20, title: 'Blog & SEO Content', category: 'Content', status: 'Not Started', priority: 'Medium', assignee: 4, week: 5, description: 'Write 10 launch blog posts targeting key keywords.', dueDate: 'Week 5-6' },
  { id: 21, title: 'FAQ & Help Center Content', category: 'Content', status: 'Not Started', priority: 'Medium', assignee: 4, week: 6, description: 'Write shipping, returns, and product FAQ pages.', dueDate: 'Week 6' },
  { id: 22, title: 'Product Photography', category: 'Content', status: 'In Progress', priority: 'High', assignee: 4, week: 4, description: 'Coordinate and upload all product images in multiple variants.', dueDate: 'Week 4' },

  // Marketing
  { id: 23, title: 'Marketing Strategy & Launch Plan', category: 'Marketing', status: 'Completed', priority: 'Critical', assignee: 5, week: 1, description: 'Define target audience, channels, budget, and KPIs.', dueDate: 'Week 1' },
  { id: 24, title: 'Social Media Profiles Setup', category: 'Marketing', status: 'Completed', priority: 'High', assignee: 5, week: 2, description: 'Set up and brand Instagram, TikTok, Pinterest, Facebook pages.', dueDate: 'Week 2' },
  { id: 25, title: 'Email Marketing Setup', category: 'Marketing', status: 'In Progress', priority: 'High', assignee: 5, week: 3, description: 'Set up Klaviyo/Mailchimp, create welcome flows, abandoned cart emails.', dueDate: 'Week 3' },
  { id: 26, title: 'Pre-Launch Social Campaign', category: 'Marketing', status: 'Not Started', priority: 'High', assignee: 5, week: 6, description: 'Run teaser campaign to build following and email list.', dueDate: 'Week 6-8' },
  { id: 27, title: 'Influencer & PR Outreach', category: 'Marketing', status: 'Not Started', priority: 'Medium', assignee: 5, week: 5, description: 'Identify and contact influencers, send PR packages, pitch media.', dueDate: 'Week 5-7' },
  { id: 28, title: 'Paid Ads Setup (Google/Meta)', category: 'Marketing', status: 'Not Started', priority: 'High', assignee: 5, week: 8, description: 'Set up Google Shopping, Meta ads for launch day campaigns.', dueDate: 'Week 8' },
  { id: 29, title: 'Launch Day Campaign', category: 'Marketing', status: 'Not Started', priority: 'Critical', assignee: 5, week: 10, description: 'Execute full launch day social, email, and ad campaign.', dueDate: 'Week 10' },

  // Testing
  { id: 30, title: 'Unit & Integration Testing', category: 'Testing', status: 'In Progress', priority: 'High', assignee: 6, week: 4, description: 'Write and run automated tests for all core features.', dueDate: 'Week 4-6' },
  { id: 31, title: 'Cross-Browser Compatibility Testing', category: 'Testing', status: 'Not Started', priority: 'High', assignee: 6, week: 7, description: 'Test on Chrome, Firefox, Safari, Edge across desktop and mobile.', dueDate: 'Week 7' },
  { id: 32, title: 'Payment Flow Testing', category: 'Testing', status: 'Not Started', priority: 'Critical', assignee: 6, week: 6, description: 'End-to-end testing of entire checkout and payment process.', dueDate: 'Week 6' },
  { id: 33, title: 'Performance & Load Testing', category: 'Testing', status: 'Not Started', priority: 'High', assignee: 6, week: 8, description: 'Stress test with simulated traffic, optimize bottlenecks.', dueDate: 'Week 8' },
  { id: 34, title: 'Security Audit', category: 'Testing', status: 'Not Started', priority: 'Critical', assignee: 6, week: 8, description: 'Run security scan, penetration testing, fix vulnerabilities.', dueDate: 'Week 8' },
  { id: 35, title: 'User Acceptance Testing (UAT)', category: 'Testing', status: 'Not Started', priority: 'High', assignee: 6, week: 9, description: 'Conduct UAT with real users, collect feedback, fix issues.', dueDate: 'Week 9' },

  // Launch
  { id: 36, title: 'Production Environment Setup', category: 'Launch', status: 'Not Started', priority: 'Critical', assignee: 3, week: 8, description: 'Configure production server, SSL, domain, DNS, CDN.', dueDate: 'Week 8' },
  { id: 37, title: 'Analytics & Tracking Setup', category: 'Launch', status: 'Not Started', priority: 'High', assignee: 2, week: 7, description: 'Implement GA4, pixel tracking, conversion events, heatmaps.', dueDate: 'Week 7' },
  { id: 38, title: 'Soft Launch & Beta Feedback', category: 'Launch', status: 'Not Started', priority: 'High', assignee: 3, week: 9, description: 'Launch to limited audience, monitor, collect and implement feedback.', dueDate: 'Week 9' },
  { id: 39, title: 'Final Bug Fixes & Polish', category: 'Launch', status: 'Not Started', priority: 'High', assignee: 2, week: 9, description: 'Address all remaining bugs and UX issues from beta feedback.', dueDate: 'Week 9-10' },
  { id: 40, title: 'Go-Live & Public Launch', category: 'Launch', status: 'Not Started', priority: 'Critical', assignee: 3, week: 10, description: 'Execute final go-live, monitor all systems, be on standby.', dueDate: 'Week 10' },
];
