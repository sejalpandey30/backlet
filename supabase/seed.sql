-- Seed data for Backlet Labs Workspace
-- Demo users: Alex Rivera (Lead Architect), Maya Chen (Full-stack Engineer), Jordan Taylor (Product Lead), Sam Wilson (Staff DevOps)

INSERT INTO profiles (id, email, full_name, avatar_url, role_title, status, bio, github_username) VALUES
('11111111-1111-1111-1111-111111111111', 'alex@backlet.dev', 'Alex Rivera', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Lead Architect', 'online', 'Building resilient distributed workflows & microservices.', 'arivera-dev'),
('22222222-2222-2222-2222-222222222222', 'maya@backlet.dev', 'Maya Chen', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'Full-stack Engineer', 'busy', 'Next.js & Supabase enthusiast. Crafting fluid UI/UX.', 'mayachen-tech'),
('33333333-3333-3333-3333-333333333333', 'jordan@backlet.dev', 'Jordan Taylor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Head of Product', 'away', 'Connecting user problems with elegant developer tools.', 'jtaylor-product'),
('44444444-4444-4444-4444-444444444444', 'sam@backlet.dev', 'Sam Wilson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Staff Infrastructure Engineer', 'online', 'Kubernetes, Terraform, CI/CD pipeline reliability.', 'swilson-ops')
ON CONFLICT (id) DO NOTHING;

-- Seed Workspace: Backlet Labs
INSERT INTO workspaces (id, name, slug, plan, owner_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backlet Labs', 'backlet-labs', 'pro', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Members
INSERT INTO workspace_members (workspace_id, profile_id, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'admin'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'member')
ON CONFLICT (workspace_id, profile_id) DO NOTHING;

-- Channels
INSERT INTO channels (id, workspace_id, name, description, is_private, created_by) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'general', 'Company-wide announcements and team discussions', FALSE, '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'engineering', 'Architecture, code reviews, deployments, and technical RFCs', FALSE, '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'product', 'Feature specs, roadmaps, customer feedback, and design syncs', FALSE, '33333333-3333-3333-3333-333333333333'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'design', 'Design system tokens, UI mockups, and prototype feedback', FALSE, '22222222-2222-2222-2222-222222222222')
ON CONFLICT (workspace_id, name) DO NOTHING;

-- Projects
INSERT INTO projects (id, workspace_id, name, key, description, lead_id, status, color, target_date, github_repo_url) VALUES
('cccccccc-cccc-cccc-cccc-cccccccc0001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backlet Web', 'BW', 'Primary collaborative web platform and Realtime engine', '11111111-1111-1111-1111-111111111111', 'active', '#6366f1', '2026-10-15', 'https://github.com/backlet/backlet-web'),
('cccccccc-cccc-cccc-cccc-cccccccc0002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AI Assistant', 'AI', 'Context-aware semantic copilot & automated meeting intelligence', '22222222-2222-2222-2222-222222222222', 'active', '#10b981', '2026-11-01', 'https://github.com/backlet/backlet-ai'),
('cccccccc-cccc-cccc-cccc-cccccccc0003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mobile App', 'MOB', 'iOS and Android client with offline sync', '33333333-3333-3333-3333-333333333333', 'planned', '#f59e0b', '2026-12-20', 'https://github.com/backlet/backlet-mobile')
ON CONFLICT (workspace_id, key) DO NOTHING;
