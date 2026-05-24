# Admin Panel Markup Blueprint

This file is a pure markup and architecture blueprint for building the admin side in another repo.
No implementation has been applied to the current app.

## 1. Design Intent

- Keep visual continuity with the existing gym theme: charcoal surfaces, oak accents, clean cards, uppercase micro-labels.
- Prioritize dense, usable admin workflows over marketing-style spacing.
- Use a persistent sidebar + top header + scrollable content layout.
- Support secure JWT admin auth with role enforcement.

---

## 2. Suggested Route Map

- /admin/login
- /admin/dashboard
- /admin/content
- /admin/coaches
- /admin/classes
- /admin/schedule
- /admin/bookings
- /admin/users

Optional nested pattern:

- /admin/content/hero
- /admin/content/copy
- /admin/content/contact

---

## 3. Folder Structure (Target Repo)

src/
  admin/
    layout/
      AdminLayout.jsx
      AdminSidebar.jsx
      AdminTopbar.jsx
    auth/
      AdminLoginPage.jsx
      AdminProtectedRoute.jsx
      adminAuthStorage.js
      adminAuthService.js
      adminApiClient.js
      adminJwt.js
    components/
      DataTable.jsx
      Pagination.jsx
      ColumnSortButton.jsx
      TableSearchBar.jsx
      Modal.jsx
      Drawer.jsx
      FormInput.jsx
      FormTextarea.jsx
      FormSelect.jsx
      ToggleSwitch.jsx
      FileUploader.jsx
      StatCard.jsx
      StatusBadge.jsx
      EmptyState.jsx
      SectionHeader.jsx
    pages/
      DashboardPage.jsx
      ContentPage.jsx
      CoachesPage.jsx
      ClassesPage.jsx
      SchedulePage.jsx
      BookingsPage.jsx
      UsersPage.jsx
      UserDetailDrawer.jsx
    data/
      mockDashboard.js
      mockBookings.js
      mockUsers.js
      mockCoaches.js
      mockClasses.js
      mockSchedule.js
    styles/
      admin.css

---

## 4. Core Layout Markup

```jsx
<div className="admin-shell">
  <aside className="admin-sidebar">
    <div className="brand">Le Studio Admin</div>
    <nav>
      <a href="/admin/dashboard">Dashboard</a>
      <a href="/admin/content">Content</a>
      <a href="/admin/coaches">Coaches</a>
      <a href="/admin/classes">Classes</a>
      <a href="/admin/schedule">Schedule</a>
      <a href="/admin/bookings">Bookings</a>
      <a href="/admin/users">Users</a>
    </nav>
  </aside>

  <div className="admin-main">
    <header className="admin-topbar">
      <div className="page-title">Dashboard</div>
      <div className="actions">
        <button>Notifications</button>
        <button>Logout</button>
      </div>
    </header>

    <main className="admin-content">
      {/* Route outlet */}
    </main>
  </div>
</div>
```

---

## 5. Security and JWT Contract

Required behavior:

- Save admin token in secure client storage strategy used by your stack.
- Attach Authorization: Bearer <token> to every admin API call.
- Decode token payload or verify via /admin/me endpoint.
- Reject access when token is missing, expired, or role is not admin.
- Redirect unauthorized users to /admin/login.

Suggested token payload shape:

```json
{
  "sub": "admin-user-id",
  "email": "admin@example.com",
  "role": "admin",
  "exp": 1760000000
}
```

Protected route rule:

- allow when token exists and role === admin and current time < exp
- otherwise clear auth state and navigate to /admin/login

---

## 6. Reusable Admin Components Markup

### DataTable

Features:

- column sorting
- pagination
- keyword search
- optional status/date/class filters
- row actions slot

Markup skeleton:

```jsx
<section className="table-card">
  <header className="table-toolbar">
    <input type="search" placeholder="Search..." />
    <div className="toolbar-right">
      {/* filters */}
      <button>Add New</button>
    </div>
  </header>

  <table className="data-table">
    <thead>
      <tr>
        <th><button>Name</button></th>
        <th><button>Status</button></th>
        <th><button>Created</button></th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* rows */}
    </tbody>
  </table>

  <footer className="pagination-bar">
    <button>Prev</button>
    <span>Page 1 of 12</span>
    <button>Next</button>
  </footer>
</section>
```

### Modal / Drawer

```jsx
<div className="overlay">
  <section className="panel modal">
    <header>
      <h3>Edit Coach</h3>
      <button>Close</button>
    </header>
    <div className="panel-body">{/* form */}</div>
    <footer>
      <button>Cancel</button>
      <button>Save</button>
    </footer>
  </section>
</div>
```

### Form Controls

```jsx
<label className="field">
  <span>Name</span>
  <input type="text" />
</label>

<label className="field">
  <span>Description</span>
  <textarea rows="4" />
</label>

<label className="field">
  <span>Active</span>
  <input type="checkbox" />
</label>

<label className="field">
  <span>Image Upload</span>
  <input type="file" accept="image/*" />
</label>
```

---

## 7. Page-by-Page Markup Specs

### A) /admin/login

```jsx
<section className="admin-auth-page">
  <form className="admin-auth-card">
    <h1>Admin Login</h1>
    <input type="email" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <button type="submit">Sign In</button>
  </form>
</section>
```

Behavior:

- call admin login endpoint
- store token and profile
- configure API interceptors
- redirect to /admin/dashboard

### B) /admin/dashboard

```jsx
<section className="dashboard-grid">
  <article className="stat-card">Total Active Users</article>
  <article className="stat-card">New Bookings This Week</article>
  <article className="stat-card">Revenue / Classes Sold</article>
  <article className="stat-card">Upcoming Classes Today</article>
</section>

<section className="dashboard-table">
  <h2>Recent Bookings Requiring Attention</h2>
  {/* DataTable */}
</section>
```

Use mock analytics until API integration is ready.

### C) /admin/content

Sections:

- Hero Slider Manager
- Website Copy Manager
- Location and Contact Manager

```jsx
<section>
  <h2>Hero Slider</h2>
  <button>Upload Media</button>
  <button>Reorder</button>
  <button>Delete</button>
</section>

<section>
  <h2>Website Copy</h2>
  <textarea placeholder="About Us" />
  <textarea placeholder="Quote" />
  <textarea placeholder="FAQ JSON/Text" />
</section>

<section>
  <h2>Location and Contact</h2>
  <input placeholder="Address" />
  <input placeholder="Phone" />
  <input placeholder="Email" />
  <input placeholder="Social links" />
</section>
```

### D) /admin/coaches

DataTable columns:

- Name
- Specialty
- Active
- Updated
- Actions

Form fields:

- Name
- Avatar/Icon upload
- Full photo upload
- Bio/Description
- Specialty
- Active toggle

### E) /admin/classes

DataTable columns:

- Class Name
- Level
- Duration
- Capacity
- Price/Tier
- Actions

Form fields:

- Class Name
- Description
- Level (Beginner, Intermediate, Advanced)
- Duration
- Capacity limit
- Price per class or membership tier requirement

### F) /admin/schedule

Layout options:

- week calendar view
- detailed agenda list

Session form fields:

- Class type
- Coach
- Date/time
- Session capacity

### G) /admin/bookings

DataTable columns:

- Booking ID
- User
- Class
- Date
- Status
- Actions

Filters:

- Status (Pending, Confirmed, Cancelled, Completed)
- Date range
- Class

Row actions:

- Approve
- Cancel
- Refund

### H) /admin/users

DataTable columns:

- Name
- Email
- Phone
- Total bookings
- Reward points
- Actions

User detail drawer:

- Profile data
- Contact info
- Booking history
- Rewards controls (Add, Deduct, History)

---

## 8. Mock Data Contracts

Use consistent contracts from day 1 to avoid refactors.

```ts
type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin';
};

type Booking = {
  id: string;
  userId: string;
  userName: string;
  classId: string;
  className: string;
  dateTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  amount: number;
};

type Coach = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatarUrl: string;
  photoUrl: string;
  active: boolean;
};
```

---

## 9. Theme Alignment Notes

- Reuse existing tone: warm neutral background, charcoal containers, oak highlights.
- Keep typography disciplined: serif for section titles, sans/body for controls and data.
- Keep table text compact and readable.
- Keep actions obvious and color-consistent (approve/confirm, warning, destructive).

---

## 10. Delivery Sequence (For Other Repo)

1. Build admin shell layout and protected route system.
2. Build /admin/login and /admin/dashboard with mock data.
3. Build shared components: DataTable, Modal/Drawer, form controls.
4. Implement CMS, Coaches, Classes.
5. Implement Schedule, Bookings, Users + Rewards.
6. Swap mock services with real APIs.
7. Add role-based tests and auth failure tests.
