# Changelog

All notable changes to SchemaVault will be documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] - 2026-10-20

### Added
- **Multi-tenant Team Management** — Invite team members with role-based access control (Admin, Editor, Viewer) per project.
- **Compare History** — Full audit trail of every schema comparison job, with diff re-playback.
- **Super Admin Dashboard** — Platform-wide user management and usage analytics for administrators.

### Improved
- Schema diff algorithm now handles renamed columns with a 40% reduction in false-positive diffs.
- Dashboard loading performance improved by 60% through optimistic UI updates and smarter caching.

### Fixed
- Resolved a race condition where two simultaneous compare jobs on the same connection could deadlock.
- Fixed OTP verification email delivery failures for addresses containing `+` characters.

---

## [1.2.1] - 2026-09-15

### Fixed
- Corrected connection string masking — password was being partially exposed in error logs.
- Fixed dark-mode flash on initial page load when system preference is set to light.
- Resolved an issue where the "Forgot Password" flow would not redirect correctly after OTP expiry.

### Security
- Upgraded `jsonwebtoken` to v9.0.2 to patch CVE-2022-23529.
- Refresh tokens are now rotated on every use (one-time-use tokens).

---

## [1.2.0] - 2026-08-28

### Added
- **Connection Health Check** — One-click connectivity test before saving a database connection.
- **Project Archiving** — Archive inactive projects without deleting historical compare data.
- PostgreSQL 16 and MySQL 8.4 officially supported.

### Improved
- Connections page redesigned with a card-based layout and instant search/filter.
- Error messages now include actionable suggestions (e.g., firewall rules, SSL config).

### Fixed
- Schema imports with circular foreign key references no longer cause an infinite loop.
- Fixed column order inconsistency when comparing views vs. base tables.

---

## [1.1.0] - 2026-07-10

### Added
- **Schema Compare Engine v2** — Side-by-side diff view with column-level change indicators.
- **Export to PDF/CSV** — Download comparison reports for offline review and audit trails.
- Support for Microsoft SQL Server (MSSQL) connections.

### Improved
- Authentication flow now uses silent token refresh — no more mid-session logouts.
- Mobile-responsive redesign for the Projects and Connections pages.

---

## [1.0.0] - 2026-06-01

### Added
- Initial public launch of SchemaVault.
- Project-based workspace management.
- PostgreSQL and MySQL connection support.
- Basic schema snapshot and comparison.
- User authentication with OTP-based password reset.
- Dark and light theme support.
