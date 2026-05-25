/* eslint-disable */
import React, { useState, useEffect } from "react";

// Helper component for SVG Sparkline
const Sparkline = ({ data, color = "#16d9ff" }) => {
  if (!data || data.length === 0) return null;
  const width = 120;
  const height = 40;
  const padding = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="sparkline">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// 1. Validated Email Form
const ValidatedEmailFormPreview = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="preview-component-wrap">
      {submitted ? (
        <div className="form-success-state">
          <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h4>Verification Sent!</h4>
          <p>We've dispatched a login verification code to: <strong>{email}</strong></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-group">
            <label>Work Email</label>
            <input
              type="text"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button type="submit" className="form-submit-btn">
            Create Free Account
          </button>
        </form>
      )}
    </div>
  );
};

// 2. Multi Step Signup Wizard
const SignupWizardPreview = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    role: "Developer",
    marketing: true,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="preview-component-wrap wizard-wrap">
      <div className="wizard-stepper">
        {[1, 2, 3].map((num) => (
          <div key={num} className={`step-node ${step >= num ? "active" : ""}`}>
            <span className="node-badge">{num}</span>
            <span className="node-label">
              {num === 1 ? "Profile" : num === 2 ? "Preferences" : "Review"}
            </span>
          </div>
        ))}
        <div className="step-progress-bar" style={{ width: `${((step - 1) / 2) * 100}%` }} />
      </div>

      <div className="wizard-content">
        {step === 1 && (
          <div className="step-pane">
            <h4>Tell us about yourself</h4>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="step-pane">
            <h4>Choose your workspace role</h4>
            <div className="role-selector-grid">
              {["Developer", "Product Manager", "Designer"].map((r) => (
                <button
                  type="button"
                  key={r}
                  className={`role-option ${formData.role === r ? "selected" : ""}`}
                  onClick={() => setFormData({ ...formData, role: r })}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="step-pane review-pane">
            <h4>Ready to initialize?</h4>
            <ul>
              <li><strong>Name:</strong> {formData.username || "Anonymous"}</li>
              <li><strong>Selected Role:</strong> {formData.role}</li>
              <li><strong>Newsletter:</strong> {formData.marketing ? "Subscribed" : "Opted out"}</li>
            </ul>
          </div>
        )}
      </div>

      <div className="wizard-footer">
        <button type="button" onClick={prevStep} disabled={step === 1} className="wizard-back-btn">
          Back
        </button>
        {step < 3 ? (
          <button type="button" onClick={nextStep} className="wizard-next-btn">
            Next
          </button>
        ) : (
          <button type="button" onClick={() => alert("Setup Complete!")} className="wizard-complete-btn">
            Launch Workspace
          </button>
        )}
      </div>
    </div>
  );
};

// 3. Role Aware Sidebar
const RoleAwareSidebarPreview = () => {
  const [userRole, setUserRole] = useState("USER");
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", roles: ["USER", "ADMIN"] },
    { name: "My Workspaces", roles: ["USER", "ADMIN"] },
    { name: "Analytics", roles: ["USER", "ADMIN"] },
    { name: "System Settings", roles: ["ADMIN"] },
    { name: "Admin Dashboard", roles: ["ADMIN"] },
  ];

  return (
    <div className="preview-component-wrap sidebar-preview-container">
      <div className="role-toggler-header">
        <label>Simulate User Role:</label>
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="USER">User (Standard Access)</option>
          <option value="ADMIN">Admin (Root Access)</option>
        </select>
      </div>

      <div className="mini-sidebar-frame">
        <div className="sidebar-brand">
          <div className="brand-dot" />
          <span>Console.io</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => (
              <button
                type="button"
                key={item.name}
                className={`sidebar-item ${activeItem === item.name ? "active" : ""}`}
                onClick={() => setActiveItem(item.name)}
              >
                {item.name}
                {item.roles.length === 1 && item.roles[0] === "ADMIN" && (
                  <span className="admin-only-badge">Admin</span>
                )}
              </button>
            ))}
        </nav>
        <div className="sidebar-user-footer">
          <div className="user-avatar">{userRole[0]}</div>
          <div className="user-info">
            <strong>Logged In</strong>
            <span>role: {userRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Breadcrumb Trail
const BreadcrumbTrailPreview = () => {
  const [path, setPath] = useState(["Workspace", "Projects", "Component Registry", "Active Preview"]);

  return (
    <div className="preview-component-wrap">
      <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
        <ol className="breadcrumbs-list">
          {path.map((crumb, idx) => {
            const isLast = idx === path.length - 1;
            return (
              <li key={crumb} className="breadcrumb-node">
                {idx > 0 && <span className="breadcrumb-separator">/</span>}
                {isLast ? (
                  <span className="breadcrumb-current" aria-current="page">
                    {crumb}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="breadcrumb-link"
                    onClick={() => setPath(path.slice(0, idx + 1))}
                  >
                    {crumb}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="breadcrumb-demo-info">
        <p>Click any parent node to traverse backward in the path tree.</p>
        <button
          type="button"
          onClick={() => setPath(["Workspace", "Projects", "Component Registry", "Active Preview"])}
          className="breadcrumb-reset-btn"
        >
          Restore Full Path
        </button>
      </div>
    </div>
  );
};

// 5. Revenue Metric Card
const RevenueMetricCardPreview = () => {
  const [timeframe, setTimeframe] = useState("30d");

  const dataMap = {
    "7d": { value: "$12,492", change: "+4.2%", positive: true, spark: [12, 14, 13, 15, 17, 16, 19] },
    "30d": { value: "$45,281", change: "+12.8%", positive: true, spark: [30, 32, 31, 35, 38, 42, 45] },
    "12m": { value: "$542,910", change: "-2.1%", positive: false, spark: [50, 48, 49, 52, 51, 55, 54, 53, 52, 51, 53, 54] },
  };

  const active = dataMap[timeframe];

  return (
    <div className="preview-component-wrap">
      <div className="metric-card-box">
        <div className="card-header-flex">
          <div>
            <span className="card-eyebrow">Gross Revenue</span>
            <strong className="card-value-display">{active.value}</strong>
          </div>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="metric-selector">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>

        <div className="card-footer-flex">
          <div className={`delta-badge ${active.positive ? "trend-up" : "trend-down"}`}>
            <span className="trend-arrow">{active.positive ? "▲" : "▼"}</span>
            {active.change} vs prev. period
          </div>
          <Sparkline data={active.spark} color={active.positive ? "#10b981" : "#ef4444"} />
        </div>
      </div>
    </div>
  );
};

// 6. Activity Timeline
const ActivityTimelinePreview = () => {
  const [filter, setFilter] = useState("ALL");

  const rawEvents = [
    { id: 1, title: "Auth token rotated", time: "10 mins ago", type: "SECURITY", text: "Security credentials updated by System Cron" },
    { id: 2, title: "Database cluster scaling completed", time: "2 hours ago", type: "INFRA", text: "Scaled up Postgres instances to support workload spike" },
    { id: 3, title: "New API Gateway route deployed", time: "5 hours ago", type: "DEPLOY", text: "FastAPI endpoints updated to include rate limit controls" },
    { id: 4, title: "Unusual traffic logs registered", time: "1 day ago", type: "SECURITY", text: "High traffic detected on /gateway/auth endpoints" },
  ];

  const filtered = filter === "ALL" ? rawEvents : rawEvents.filter((e) => e.type === filter);

  return (
    <div className="preview-component-wrap">
      <div className="timeline-filters">
        {["ALL", "SECURITY", "INFRA", "DEPLOY"].map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setFilter(category)}
            className={`filter-tab ${filter === category ? "active" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="timeline-list">
        {filtered.map((item) => (
          <div key={item.id} className="timeline-row-item">
            <div className={`timeline-node-dot type-${item.type.toLowerCase()}`} />
            <div className="timeline-row-content">
              <div className="timeline-row-header">
                <strong>{item.title}</strong>
                <span className="timeline-row-time">{item.time}</span>
              </div>
              <p>{item.text}</p>
              <span className={`timeline-row-badge type-${item.type.toLowerCase()}`}>{item.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Data Table Toolbar
const DataTableToolbarPreview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [columnsVisible, setColumnsVisible] = useState(false);

  return (
    <div className="preview-component-wrap">
      <div className="premium-table-toolbar">
        <div className="toolbar-search-input">
          <svg className="search-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Filter components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-actions-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="toolbar-dropdown">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="DEPRECATED">Deprecated</option>
          </select>

          <div className="columns-selector-wrap">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => setColumnsVisible(!columnsVisible)}
            >
              Columns ▼
            </button>
            {columnsVisible && (
              <div className="columns-dropdown-popup">
                <label><input type="checkbox" defaultChecked /> ID</label>
                <label><input type="checkbox" defaultChecked /> Name</label>
                <label><input type="checkbox" defaultChecked /> Category</label>
                <label><input type="checkbox" defaultChecked /> Status</label>
              </div>
            )}
          </div>

          <button type="button" className="toolbar-export-btn" onClick={() => alert("CSV Export Triggered")}>
            Export CSV
          </button>
        </div>
      </div>
      <div className="toolbar-preview-state">
        Active Filters: <code>Search: "{searchTerm || "None"}", Status: "{statusFilter}"</code>
      </div>
    </div>
  );
};

// 8. Async Toast Center
const AsyncToastCenterPreview = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <div className="preview-component-wrap toast-demo-container">
      <div className="toast-actions-trigger-row">
        <button
          type="button"
          onClick={() => addToast("success", "Success Alert", "Component configuration saved successfully.")}
          className="toast-trigger-btn success-trigger"
        >
          Trigger Success
        </button>
        <button
          type="button"
          onClick={() => addToast("error", "Error Alert", "Could not synchronize with Postgres db.")}
          className="toast-trigger-btn error-trigger"
        >
          Trigger Error
        </button>
        <button
          type="button"
          onClick={() => addToast("info", "Information Alert", "Server maintenance starts in 30 minutes.")}
          className="toast-trigger-btn info-trigger"
        >
          Trigger Info
        </button>
      </div>

      <div className="mini-toast-list">
        {toasts.map((toast) => (
          <div key={toast.id} className={`preview-toast-item toast-${toast.type}`}>
            <div className="toast-content-body">
              <strong>{toast.title}</strong>
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToasts((current) => current.filter((t) => t.id !== toast.id))}
              className="toast-close"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 9. Confirmation Modal
const ConfirmationModalPreview = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="preview-component-wrap">
      <button type="button" onClick={() => setIsOpen(true)} className="modal-trigger-action-btn">
        Delete Component Account
      </button>

      {isOpen && (
        <div className="mini-modal-overlay">
          <div className="mini-modal-box">
            <h4>Confirm Destructive Action</h4>
            <p>
              Are you absolutely sure you want to delete this component? This operation is permanent
              and will delete references in PostgreSQL database and cached embeddings.
            </p>
            <div className="mini-modal-footer">
              <button type="button" onClick={() => setIsOpen(false)} className="modal-cancel-btn">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Resource deleted successfully.");
                  setIsOpen(false);
                }}
                className="modal-danger-btn"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 10. Empty State Panel
const EmptyStatePanelPreview = () => {
  return (
    <div className="preview-component-wrap">
      <div className="premium-empty-panel-box">
        <svg className="empty-panel-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m0 4h18" />
        </svg>
        <h3>No Components Matched</h3>
        <p>
          We couldn't locate any registry records matching your filters. Try adjusting your query or resetting your active category.
        </p>
        <button type="button" onClick={() => alert("Filters reset!")} className="empty-panel-action-btn">
          Clear Search Filters
        </button>
      </div>
    </div>
  );
};

// Map names to full codes, usage, and interactive components
export const REAL_COMPONENTS_MAP = {
  "Validated Email Form": {
    code: `import React, { useState } from "react";

export function ValidatedEmailForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.({ email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          className={\`p-2 border rounded-md \${errors.email ? "border-red-500" : "border-gray-300"}\`}
          placeholder="name@domain.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: null });
          }}
        />
        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          className={\`p-2 border rounded-md \${errors.password ? "border-red-500" : "border-gray-300"}\`}
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: null });
          }}
        />
        {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password}</span>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
}`,
    usage: `import { ValidatedEmailForm } from "./components/ValidatedEmailForm";

export default function Register() {
  const handleRegisterSubmit = async (credentials) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Registration failed");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <ValidatedEmailForm onSubmit={handleRegisterSubmit} />
    </div>
  );
}`,
    Preview: ValidatedEmailFormPreview,
  },
  "Multi Step Signup Wizard": {
    code: `import React, { useState } from "react";

export function SignupWizard({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete?.(formData);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white max-w-lg">
      <div className="flex justify-between items-center mb-6">
        {steps.map((s, index) => (
          <div key={index} className="flex items-center">
            <span className={\`w-8 height-8 rounded-full flex items-center justify-center text-sm font-semibold \${
              currentStep >= index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
            }\`}>
              {index + 1}
            </span>
            <span className="text-xs ml-2 hidden sm:inline">{s.title}</span>
            {index < steps.length - 1 && (
              <span className="mx-2 text-gray-300">➔</span>
            )}
          </div>
        ))}
      </div>

      <div className="mb-8 min-h-[120px]">
        <StepComponent formData={formData} setFormData={setFormData} />
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 border rounded-md text-gray-600 disabled:opacity-40 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isLastStep ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}`,
    usage: `import { SignupWizard } from "./components/SignupWizard";

const ProfileStep = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Company Name</label>
    <input
      className="p-2 border w-full rounded"
      value={formData.company || ""}
      onChange={e => setFormData({ ...formData, company: e.target.value })}
      placeholder="Acme Corp"
    />
  </div>
);

const PlanStep = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium mb-2">Billing Plan</label>
    <select
      className="p-2 border w-full rounded"
      value={formData.plan || "Growth"}
      onChange={e => setFormData({ ...formData, plan: e.target.value })}
    >
      <option value="Starter">Starter - $19/mo</option>
      <option value="Growth">Growth - $49/mo</option>
      <option value="Enterprise">Enterprise - Custom</option>
    </select>
  </div>
);

export default function SetupWizard() {
  const steps = [
    { title: "Workspace", component: ProfileStep },
    { title: "Subscription", component: PlanStep }
  ];

  return (
    <SignupWizard
      steps={steps}
      onComplete={(data) => console.log("Finalized configuration:", data)}
    />
  );
}`,
    Preview: SignupWizardPreview,
  },
  "Role Aware Sidebar": {
    code: `import React from "react";

export function RoleAwareSidebar({ role, items, activeItem, onNavigate }) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center space-x-2">
        <span className="w-3 h-3 bg-indigo-500 rounded-full" />
        <span className="font-bold text-lg">Control Tower</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items
          .filter((item) => !item.roles || item.roles.includes(role))
          .map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={\`w-full text-left p-2.5 rounded-lg flex items-center justify-between text-sm transition-colors \${
                  isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }\`}
              >
                <span>{item.label}</span>
                {item.adminOnly && (
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </button>
            );
          })}
      </nav>
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        Signed in as role: <code className="text-gray-300 font-mono">{role}</code>
      </div>
    </div>
  );
}`,
    usage: `import { RoleAwareSidebar } from "./components/RoleAwareSidebar";

export default function Layout() {
  const routes = [
    { id: "dash", label: "My Dashboard", roles: ["USER", "ADMIN"] },
    { id: "repo", label: "Repositories", roles: ["USER", "ADMIN"] },
    { id: "users", label: "Identity Console", roles: ["ADMIN"], adminOnly: true },
    { id: "sys", label: "Cluster Settings", roles: ["ADMIN"], adminOnly: true },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <RoleAwareSidebar
        role="ADMIN"
        items={routes}
        activeItem="dash"
        onNavigate={(id) => console.log("Routing direction:", id)}
      />
      <div className="flex-1 p-8">Content stage...</div>
    </div>
  );
}`,
    Preview: RoleAwareSidebarPreview,
  },
  "Breadcrumb Trail": {
    code: `import React from "react";

export function BreadcrumbTrail({ items, onNavigate }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((crumb, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={crumb.id} className="inline-flex items-center">
              {idx > 0 && (
                <span className="mx-2 text-gray-400 text-sm" role="presentation">
                  /
                </span>
              )}
              {isLast ? (
                <span className="text-sm font-semibold text-gray-700" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate?.(crumb.id)}
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
    usage: `import { BreadcrumbTrail } from "./components/BreadcrumbTrail";

export default function WorkspaceHeader() {
  const crumbs = [
    { id: "root", label: "Root Workspace" },
    { id: "proj-1", label: "Enterprise Registry" },
    { id: "active", label: "Component Detail (v1.0.0)" }
  ];

  return (
    <header className="border-b bg-white p-4">
      <BreadcrumbTrail items={crumbs} onNavigate={(id) => console.log("Navigating to id:", id)} />
    </header>
  );
}`,
    Preview: BreadcrumbTrailPreview,
  },
  "Revenue Metric Card": {
    code: `import React from "react";

export function RevenueMetricCard({ title, value, delta, timeframe, positive, sparkData }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between min-w-[260px]">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          <strong className="block text-2xl font-bold text-gray-900 mt-1">
            {value}
          </strong>
        </div>
        {timeframe && (
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {timeframe}
          </span>
        )}
      </div>

      <div className="flex justify-between items-end mt-4">
        <div className={\`flex items-center text-xs font-medium \${
          positive ? "text-emerald-600" : "text-rose-600"
        }\`}>
          <span className="mr-1">{positive ? "▲" : "▼"}</span>
          {delta}
        </div>
        
        {sparkData && sparkData.length > 0 && (
          <svg width="100" height="32" className="opacity-80">
            <polyline
              fill="none"
              stroke={positive ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              points={sparkData
                .map((val, idx) => {
                  const x = (idx / (sparkData.length - 1)) * 96 + 2;
                  const max = Math.max(...sparkData);
                  const min = Math.min(...sparkData);
                  const range = max - min || 1;
                  const y = 30 - ((val - min) / range) * 28;
                  return \`\${x},\${y}\`;
                })
                .join(" ")}
            />
          </svg>
        )}
      </div>
    </div>
  );
}`,
    usage: `import { RevenueMetricCard } from "./components/RevenueMetricCard";

export default function AnalyticsDashboard() {
  const mockSpark = [12, 14, 15, 14, 18, 22, 21, 24];

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <RevenueMetricCard
        title="Monthly Revenue"
        value="$48,912"
        delta="+8.4%"
        timeframe="30 days"
        positive={true}
        sparkData={mockSpark}
      />
    </div>
  );
}`,
    Preview: RevenueMetricCardPreview,
  },
  "Activity Timeline": {
    code: `import React from "react";

export function ActivityTimeline({ events, emptyText = "No activities registered." }) {
  if (!events || events.length === 0) {
    return <p className="text-gray-400 text-sm">{emptyText}</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white text-white font-semibold text-xs">
                    {event.type[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-800">
                      {event.title} <span className="text-gray-500">{event.details}</span>
                    </p>
                  </div>
                  <div className="text-right text-xs whitespace-nowrap text-gray-400">
                    <time>{event.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    usage: `import { ActivityTimeline } from "./components/ActivityTimeline";

export default function LogsView() {
  const events = [
    { id: 1, type: "Sec", title: "API credentials rotated", details: "Key rotation Cron", time: "1h ago" },
    { id: 2, type: "Sys", title: "Deployment scale out completed", details: "Server scaling", time: "4h ago" }
  ];

  return (
    <div className="max-w-md p-6 bg-white border rounded shadow-sm">
      <h3 className="font-bold text-lg mb-6">Audits Timeline</h3>
      <ActivityTimeline events={events} />
    </div>
  );
}`,
    Preview: ActivityTimelinePreview,
  },
  "Data Table Toolbar": {
    code: `import React from "react";

export function DataTableToolbar({ searchPlaceholder = "Search...", onSearch, onClear, filters, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-gray-50 border-b">
      <div className="relative w-full sm:max-w-xs">
        <input
          type="text"
          className="w-full p-2 pl-8 border rounded-md text-sm"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <span className="absolute left-2.5 top-2.5 text-gray-400">🔍</span>
      </div>

      <div className="flex gap-2 w-full sm:w-auto justify-end">
        {filters &&
          filters.map((filter) => (
            <select
              key={filter.id}
              className="p-2 border rounded-md text-xs bg-white"
              onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
            >
              <option value="ALL">All {filter.label}</option>
              {filter.options.map((opt) => (
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-2 text-xs border rounded-md hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}`,
    usage: `import { DataTableToolbar } from "./components/DataTableToolbar";

export default function TableStage() {
  const dropdownFilters = [
    {
      id: "status",
      label: "Statuses",
      options: [
        { label: "Active", value: "active" },
        { label: "Deprecated", value: "deprecated" }
      ]
    }
  ];

  return (
    <DataTableToolbar
      searchPlaceholder="Search components catalog..."
      filters={dropdownFilters}
      onSearch={(q) => console.log("Searching for:", q)}
      onFilterChange={(id, val) => console.log("Filtering:", id, "value:", val)}
      onClear={() => console.log("Clearing all filters")}
    />
  );
}`,
    Preview: DataTableToolbarPreview,
  },
  "Async Toast Center": {
    code: `import React, { useState } from "react";

export function ToastCenter({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={\`p-4 rounded-lg shadow-lg flex justify-between items-start text-white transition-all \${
            t.type === "success"
              ? "bg-emerald-600"
              : t.type === "error"
              ? "bg-rose-600"
              : "bg-indigo-600"
          }\`}
        >
          <div className="flex-1 pr-4">
            <h5 className="font-bold text-sm">{t.title}</h5>
            <p className="text-xs mt-1 opacity-90">{t.message}</p>
          </div>
          <button
            type="button"
            className="text-white hover:text-gray-200 font-bold"
            onClick={() => onRemove?.(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}`,
    usage: `import { ToastCenter } from "./components/ToastCenter";
import { useState } from "react";

export default function PageLayout() {
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <div>
      <button onClick={() => showToast("Success", "File saved successfully")}>
        Save Changes
      </button>
      <ToastCenter toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}`,
    Preview: AsyncToastCenterPreview,
  },
  "Confirmation Modal": {
    code: `import React from "react";

export function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white border rounded-xl shadow-xl w-full max-w-md p-6 m-4" role="dialog" aria-modal="true">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    usage: `import { ConfirmationModal } from "./components/ConfirmationModal";
import { useState } from "react";

export default function SettingsStage() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)} className="text-red-500">
        Delete Profile
      </button>
      <ConfirmationModal
        isOpen={open}
        title="Permanently Delete Account?"
        message="This decision is immediate. You will forfeit all active credits and deployment domains."
        confirmText="Confirm Delete"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          console.log("Account destroyed");
          setOpen(false);
        }}
      />
    </div>
  );
}`,
    Preview: ConfirmationModalPreview,
  },
  "Empty State Panel": {
    code: `import React from "react";

export function EmptyStatePanel({ title = "No records found", description = "Try creating a new entry to get started.", actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl text-gray-400">
        📭
      </div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-md text-xs hover:bg-blue-700 font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}`,
    usage: `import { EmptyStatePanel } from "./components/EmptyStatePanel";

export default function WorkspaceIndex() {
  return (
    <div className="p-8">
      <EmptyStatePanel
        title="No components found in category"
        description="Try relaxing your search terms or register a brand-new component pattern to the library."
        actionLabel="Register Component"
        onAction={() => console.log("Navigate to add view")}
      />
    </div>
  );
}`,
    Preview: EmptyStatePanelPreview,
  },
};