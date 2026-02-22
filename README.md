# 🖥️ Content Workflow System  
Mini Project #1 – Frontend Development

A Role-Based Content Management System (CMS) built with **Next.js (App Router)** and **Supabase** that simulates a real-world content approval pipeline where different user roles interact through a controlled workflow secured by database-level policies.

This project implements:
- Authentication  
- Role-Based Access Control (RBAC)  
- CRUD Operations  
- Workflow System  
- Table Features (Pagination, Sorting, Search, Page Size)  
- Storage Integration  
- Row Level Security (RLS)  
- Middleware Protection  

---

## 🏗 Tech Stack

### 🚀 Core
![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)

### 🎨 UI & State
![Material UI](https://img.shields.io/badge/MUI-Material%20UI-007FFF?logo=mui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Utility%20First-38B2AC?logo=tailwindcss&logoColor=white)
![TanStack Table](https://img.shields.io/badge/TanStack-Table-FF4154)

### 🛠 Development Tools
![ESLint](https://img.shields.io/badge/ESLint-Code%20Linting-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-Code%20Formatter-F7B93E?logo=prettier&logoColor=black)
![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?logo=git&logoColor=white)

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
↘ Rejected → Back to Creator

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
<img width="994" height="711" alt="Supabase Schema CWS" src="https://github.com/user-attachments/assets/710cbaf1-9ca2-458b-9907-878a0f4a8ee3" />

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

All access control is enforced at the database level to ensure security even if frontend restrictions are bypassed.

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

## 🏛 Architecture Overview

Authentication → Supabase Auth  
Authorization → Role-based access via `profiles` & `roles`  
Data Access → Supabase with Row Level Security (RLS)  
Frontend Protection → Middleware + Conditional Rendering  
Storage → Supabase Bucket (`content-files`)


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
The following accounts are pre-seeded in the database for demonstration and RBAC testing purposes.
These accounts are manually created in Supabase and mapped to specific roles to simulate real workflow scenarios.

### 👑 Admin
Email: admin@kalbe.com  
Password: kalbe123  

### ✍️ Creator
Email: creator@kalbe.com  
Password: kalbe123  

### 🔍 Reviewer
Email: reviewer@kalbe.com  
Password: kalbe123  

---

## 🎥 Demo Presentation
A complete walkthrough of the system (from login to published content) is available in the presentation below:

📎 **Demo Slide (PPT):**
https://www.canva.com/design/DAHCEPQ4vP4/wM1i1BcgEwIJfITyV90BXA/view?utm_content=DAHCEPQ4vP4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hccc4ade8b9

This demo covers:
- Authentication & RBAC implementation  
- End-to-end workflow (Draft → Review → Approved → Published)  
- Table features (Sorting, Searching, Pagination)  
- Supabase configuration (RLS & RPC)  

---

## 📹 Demo Video (Coming Soon)
A short video demonstration showcasing the full workflow in real-time (Creator → Reviewer → Admin).

The video link will be updated here once available.

The video will highlight:
- Role-based dashboard experience  
- Content approval flow  
- Status transitions  
- Table interaction (search, sort, pagination)

---

## 🎯 Learning Outcomes
- Implemented secure RBAC using Supabase
- Enforced Row Level Security (RLS)
- Designed workflow-based content lifecycle
- Integrated TanStack Table with advanced features
- Structured a role-aware dashboard experience

## 📄 License
Educational Project – Mini Project #1 - Eunice
