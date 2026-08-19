-- Seed data for ClientPulse SaaS (PostgreSQL 17)

INSERT INTO users (id, name, email, password_hash, company_name)
VALUES ('usr-01', 'James Donnelly', 'james@acmedigital.co', '$2b$12$e8Y5l0.u1XGZ52...dummyHash', 'Acme Digital Co.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO clients (id, user_id, company_name, domain, contact_name, contact_email, phone, status, mrr_amount, total_billed, unpaid_amount)
VALUES 
('cli-01', 'usr-01', 'Acme Corporation', 'acme.com', 'Sarah Jenkins', 'sarah@acme.com', '+1 (555) 234-5678', 'active', 4500.00, 13500.00, 0.00),
('cli-02', 'usr-01', 'Innovate Labs', 'innovatelabs.io', 'David Zhang', 'david@innovatelabs.io', '+1 (555) 345-6789', 'onboarding', 2950.00, 5900.00, 1200.00),
('cli-03', 'usr-01', 'Global Ventures', 'globalventures.com', 'Elena Rostova', 'elena@globalventures.com', '+1 (555) 456-7890', 'active', 7750.00, 23250.00, 0.00),
('cli-04', 'usr-01', 'Spark Products', 'sparkproducts.com', 'Marcus Miller', 'marcus@sparkproducts.com', '+1 (555) 567-8901', 'paused', 1200.00, 2400.00, 1000.00),
('cli-05', 'usr-01', 'Nexus Systems', 'nexussystems.tech', 'Amanda Clarke', 'amanda@nexussystems.tech', '+1 (555) 678-9012', 'active', 5200.00, 18400.00, 0.00),
('cli-06', 'usr-01', 'Apex Digital', 'apexdigital.co', 'Brian Taylor', 'brian@apexdigital.co', '+1 (555) 789-0123', 'active', 3250.00, 9750.00, 2000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, client_id, name, budget, status, deadline)
VALUES
('proj-01', 'cli-01', 'Enterprise Cloud Migration', 28000.00, 'in_progress', '2025-07-15'),
('proj-02', 'cli-03', 'Global Fintech Mobile App', 45000.00, 'in_progress', '2025-08-30'),
('proj-03', 'cli-02', 'AI Analytics Pipeline & Dashboard', 18500.00, 'planning', '2025-09-15'),
('proj-04', 'cli-04', 'E-commerce Checkout Redesign', 12000.00, 'on_hold', '2025-06-20'),
('proj-05', 'cli-05', 'Security Audit & Compliance Tool', 32000.00, 'completed', '2025-05-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (id, client_id, invoice_code, amount, due_date, status, paid_at)
VALUES
('inv-01', 'cli-02', 'INV-2025-054', 1200.00, '2025-06-10', 'unpaid', NULL),
('inv-02', 'cli-04', 'INV-2025-053', 1000.00, '2025-06-05', 'unpaid', NULL),
('inv-03', 'cli-06', 'INV-2025-052', 2000.00, '2025-05-28', 'overdue', NULL),
('inv-04', 'cli-01', 'INV-2025-051', 4500.00, '2025-05-30', 'paid', '2025-05-29 16:00:00+00'),
('inv-05', 'cli-03', 'INV-2025-050', 7750.00, '2025-05-25', 'paid', '2025-05-24 10:45:00+00')
ON CONFLICT (id) DO NOTHING;
