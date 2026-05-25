INSERT INTO users (name, email, password, role)
SELECT seed.name, seed.email, seed.password, seed.role
FROM (
  VALUES
    ('Admin', 'admin@gmail.com', 'admin123', 'ADMIN'),
    ('User', 'user@gmail.com', 'user123', 'USER')
) AS seed(name, email, password, role)
WHERE NOT EXISTS (
  SELECT 1
  FROM users existing
  WHERE existing.email = seed.email
);

INSERT INTO categories (name, description)
SELECT seed.name, seed.description
FROM (
  VALUES
    ('Forms', 'Inputs, validators, and form workflows'),
    ('Navigation', 'Menus, tabs, breadcrumbs, and layout navigation'),
    ('Dashboard', 'Cards, charts, metrics, and reporting widgets'),
    ('Feedback', 'Alerts, toast messages, loaders, and modals')
) AS seed(name, description)
WHERE NOT EXISTS (
  SELECT 1
  FROM categories existing
  WHERE existing.name = seed.name
);

INSERT INTO components
  (name, category, description, documentation, code_snippet, usage_example, created_by)
SELECT
  seed.name,
  seed.category,
  seed.description,
  seed.documentation,
  seed.code_snippet,
  seed.usage_example,
  seed.created_by
FROM (
  VALUES
    (
      'Validated Email Form',
      'Forms',
      'Reusable form component with email validation and inline error states.',
      'Use for login, signup, and profile forms requiring email validation.',
      '<ValidatedEmailForm required />',
      '<ValidatedEmailForm onSubmit={handleSubmit} />',
      'admin@gmail.com'
    ),
    (
      'Multi Step Signup Wizard',
      'Forms',
      'Guided signup flow with validation, progress state, and review step.',
      'Use when collecting longer onboarding or profile data across multiple steps.',
      '<SignupWizard steps={steps} />',
      '<SignupWizard steps={steps} onComplete={createAccount} />',
      'admin@gmail.com'
    ),
    (
      'Role Aware Sidebar',
      'Navigation',
      'Navigation sidebar that renders links based on user role.',
      'Provide the authenticated user role and route config to hide unauthorized links.',
      '<RoleAwareSidebar role="ADMIN" />',
      '<RoleAwareSidebar role={currentUser.role} items={routes} />',
      'admin@gmail.com'
    ),
    (
      'Breadcrumb Trail',
      'Navigation',
      'Compact breadcrumb navigation for nested pages and detail screens.',
      'Pass the current route hierarchy so users can quickly return to parent views.',
      '<BreadcrumbTrail items={items} />',
      '<BreadcrumbTrail items={crumbs} onNavigate={navigate} />',
      'admin@gmail.com'
    ),
    (
      'Revenue Metric Card',
      'Dashboard',
      'Dashboard widget for displaying KPI value, delta, and trend.',
      'Use inside analytics dashboards and reporting pages.',
      '<RevenueMetricCard value="42K" trend="up" />',
      '<RevenueMetricCard title="Revenue" value="$42K" delta="+12%" />',
      'admin@gmail.com'
    ),
    (
      'Activity Timeline',
      'Dashboard',
      'Chronological activity feed for audits, approvals, and recent events.',
      'Provide timestamped events and optional status metadata for each row.',
      '<ActivityTimeline events={events} />',
      '<ActivityTimeline events={auditEvents} emptyText="No activity yet" />',
      'admin@gmail.com'
    ),
    (
      'Data Table Toolbar',
      'Dashboard',
      'Reusable table controls for search, filters, export, and column actions.',
      'Place above dense data tables that need quick filtering and bulk actions.',
      '<DataTableToolbar />',
      '<DataTableToolbar filters={filters} onExport={exportCsv} />',
      'admin@gmail.com'
    ),
    (
      'Async Toast Center',
      'Feedback',
      'Feedback component for success, error, and loading messages.',
      'Use around API operations to provide non-blocking status feedback.',
      '<ToastCenter position="top-right" />',
      '<ToastCenter messages={messages} onDismiss={dismissToast} />',
      'admin@gmail.com'
    ),
    (
      'Confirmation Modal',
      'Feedback',
      'Accessible confirmation dialog for destructive or high-impact actions.',
      'Use before deletes, publishes, approvals, and irreversible workflow changes.',
      '<ConfirmationModal open={open} />',
      '<ConfirmationModal open={open} title="Delete component?" onConfirm={remove} />',
      'admin@gmail.com'
    ),
    (
      'Empty State Panel',
      'Feedback',
      'Helpful empty state with icon, message, and primary recovery action.',
      'Use when lists, searches, dashboards, or admin queues have no records.',
      '<EmptyStatePanel title="No components" />',
      '<EmptyStatePanel title="No results" actionLabel="Clear search" onAction={reset} />',
      'admin@gmail.com'
    )
) AS seed(name, category, description, documentation, code_snippet, usage_example, created_by)
WHERE NOT EXISTS (
  SELECT 1
  FROM components existing
  WHERE existing.name = seed.name
);

UPDATE components
SET
  tags = CASE name
    WHEN 'Validated Email Form' THEN 'forms,validation,email,a11y'
    WHEN 'Multi Step Signup Wizard' THEN 'forms,onboarding,wizard,validation'
    WHEN 'Role Aware Sidebar' THEN 'navigation,rbac,admin,dashboard'
    WHEN 'Breadcrumb Trail' THEN 'navigation,routing,detail-pages'
    WHEN 'Revenue Metric Card' THEN 'dashboard,kpi,analytics,widgets'
    WHEN 'Activity Timeline' THEN 'dashboard,audit,events,history'
    WHEN 'Data Table Toolbar' THEN 'dashboard,table,filters,export'
    WHEN 'Async Toast Center' THEN 'feedback,toast,async,status'
    WHEN 'Confirmation Modal' THEN 'feedback,modal,destructive,a11y'
    WHEN 'Empty State Panel' THEN 'feedback,empty-state,recovery'
    ELSE tags
  END,
  version = COALESCE(version, '1.0.0'),
  status = COALESCE(status, 'Published'),
  preview_image = COALESCE(preview_image, 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80'),
  props_table = COALESCE(props_table, 'prop | type | required | description'),
  installation_guide = COALESCE(installation_guide, 'Install from the internal design system package, import the component, then pass the documented props.'),
  accessibility_notes = COALESCE(accessibility_notes, 'Keyboard navigation, visible focus states, semantic markup, and ARIA labels should be verified before production use.'),
  best_practices = COALESCE(best_practices, 'Use consistent spacing, keep props explicit, document edge cases, and pair the component with design tokens.');

INSERT INTO component_tags (component_id, tag)
SELECT c.id, tag.value
FROM components c
CROSS JOIN LATERAL regexp_split_to_table(COALESCE(c.tags, ''), ',') AS tag(value)
WHERE tag.value <> ''
  AND NOT EXISTS (
    SELECT 1 FROM component_tags existing
    WHERE existing.component_id = c.id AND existing.tag = tag.value
  );

INSERT INTO component_versions (component_id, version, changelog, source_code)
SELECT id, COALESCE(version, '1.0.0'), 'Initial reusable component release.', COALESCE(code_snippet, '<Component />')
FROM components c
WHERE NOT EXISTS (
  SELECT 1 FROM component_versions existing
  WHERE existing.component_id = c.id AND existing.version = COALESCE(c.version, '1.0.0')
);

INSERT INTO reviews (component_id, user_email, rating, comment)
SELECT id, 'user@gmail.com', 5, 'Clear documentation and useful preview for implementation.'
FROM components c
WHERE name IN ('Validated Email Form', 'Revenue Metric Card', 'Async Toast Center')
  AND NOT EXISTS (
    SELECT 1 FROM reviews existing
    WHERE existing.component_id = c.id AND existing.user_email = 'user@gmail.com'
  );