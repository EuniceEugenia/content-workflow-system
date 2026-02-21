# Content Workflow System  
Mini Project #1 – Frontend Development

A Role-Based Content Management System (CMS) built with **Next.js (App Router)** and **Supabase**.

This project implements:
- Authentication  
- Role-Based Access Control (RBAC)  
- CRUD Operations  
- Workflow System  
- Table Features (Pagination, Sorting, Search)  
- Storage Integration  
- Row Level Security (RLS)  
- Middleware Protection  

---

## 🏗 Tech Stack

### Core
- Next.js (App Router)
- Supabase (PostgreSQL + Auth + Storage)

### UI & State
- Material UI
- TailwindCSS
- TanStack Table

### Dev Tools
- ESLint
- Prettier
- Git

---

## ✅ Features

### 1️⃣ Authentication
- Email & Password login via Supabase
- SSR-compatible auth using `@supabase/ssr`
- Middleware route protection
- Protected `/dashboard` routes

---

### 2️⃣ RBAC (3 Roles)
| Role     | Access |
|----------|--------|
| Admin    | Publish & delete content |
| Creator  | Create, edit draft, submit for review |
| Reviewer | Approve or reject content |

Authorization enforced in:
- Frontend (UI-level control)
- Database (Row Level Security)

---

### 3️⃣ CRUD (contents table)
- Create content (Draft)
- Read content (based on role visibility)
- Update (restricted by role & status)
- Delete (restricted to Admin)

---

### 4️⃣ Workflow System
Draft → Review → Approved → Published  
↘ Rejected  

Flow:
- Creator creates **Draft**
- Creator submits → **Review**
- Reviewer approves → **Approved**
- Reviewer rejects → **Rejected**
- Admin publishes → **Published**

All transitions are protected by RLS policies.

---

### 5️⃣ Table Features (TanStack Table)
- Pagination
- Sorting
- Searching
- Page Size selection

---

## 🗄 Supabase Configuration

### 📌 Tables (Minimum 5 – Excluding `auth.users`)
1. roles  
2. profiles  
3. contents  
4. categories  
5. attachments  

All tables are relational.

---

### 📦 Storage Bucket
- Bucket name: `content-files`
- Linked via `file_path`
- Access controlled via storage policies

---

### 🔐 RLS (Row Level Security)
Enabled on:
- `profiles`
- `contents`

Example policies:
- Creator can update only own Draft
- Reviewer can update only content in Review
- Admin can publish Approved content
- Reviewer cannot delete content

Database-level protection ensures security even if frontend is bypassed.

---

## 🛡 Middleware Protection
- Blocks unauthenticated access to `/dashboard`
- Redirects authenticated users away from `/`
- Uses SSR-compatible Supabase client

---

## 🗂 Database Schema (Simplified)

### roles
| id | name |
|----|------|
| 1  | Admin |
| 2  | Creator |
| 3  | Reviewer |

---

### profiles
| id (UUID from auth.users) | full_name | role_id |

---

### contents
| id | title | body | status | author_id | reviewer_id | category_id | created_at | file_path |

---

## ▶️ How To Run

### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd content-workflow-system
```

---

### 2️⃣ Install Dependencies
```bash
npm install
```

---

### 3️⃣ Setup Supabase
1. Create a Supabase project  
2. Enable Email/Password authentication  
3. Create tables:
   - roles
   - profiles
   - contents
   - categories
   - attachments  
4. Enable RLS on:
   - profiles
   - contents  
5. Create storage bucket:
   - `content-files`

---

### 4️⃣ Setup Environment Variables
Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

### 5️⃣ Run Development Server
```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🧪 Test Accounts
For demonstration purposes:
### 👑 Admin
Email: admin@kalbe.com  
Password: kalbe123  

### ✍️ Creator
Email: creator@kalbe.com  
Password: kalbe123  

### 🔍 Reviewer
Email: reviewer@kalbe.com  
Password: kalbe123  

⚠️ These accounts are seeded for testing purposes only.

---

## 🎯 Learning Outcomes
- RBAC implementation
- Secure RLS enforcement
- Workflow-based system design
- Middleware authentication guard
- TanStack Table integration
- Supabase integration
- Relational database modeling

---

## 📄 License
Educational Project – Mini Project #1
