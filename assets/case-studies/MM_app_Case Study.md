# Mentes en Movimiento
## Mobile App Case Study

---

## Overview

**Mentes en Movimiento** is a comprehensive therapy management platform designed for multi-location pediatric clinics offering speech therapy (Logopedia), physiotherapy, and movement therapy. The app bridges clinical operations, educational support, and family engagement through a secure, role-based mobile experience.

| | |
|---|---|
| **Role** | Full-Stack Mobile Developer |
| **Timeline** | 4 weeks |
| **Platform** | iOS & Android |
| **Tech Stack** | React Native, Expo, TypeScript, Supabase, PostgreSQL |

---

## The Challenge

Pediatric therapy clinics managing multiple locations faced several operational challenges:

- **Fragmented communication** between therapists, teachers, and parents
- **Paper-based medical records** with no secure digital access
- **No unified scheduling** across multiple clinic locations
- **Privacy concerns** when sharing sensitive child information
- **Lack of transparency** for parents about therapy progress

The clinic needed a mobile-first solution that could:
1. Support 5 distinct user roles with different access levels
2. Ensure complete data isolation between clinic locations
3. Meet Apple App Store privacy requirements
4. Provide real-time communication while maintaining HIPAA-like security

---

## Solution Architecture

### Role-Based Access Control

I designed a hierarchical permission system supporting 5 user types:

```
┌─────────────────────────────────────────┐
│          DIRECTOR (Global)              │
│    Manages all clinics, can impersonate │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   ┌────────┐  ┌────────┐  ┌────────┐
   │ Clinic │  │ Clinic │  │ Clinic │
   │   A    │  │   B    │  │   C    │
   └───┬────┘  └───┬────┘  └───┬────┘
   [Manager]   [Manager]   [Manager]
       │           │           │
   [Staff]     [Staff]     [Staff]
       │           │           │
   [Teachers]  [Teachers]  [Teachers]
       │           │           │
   [Parents]   [Parents]   [Parents]
```

| Role | Scope | Key Capabilities |
|------|-------|------------------|
| **Director** | All clinics | Create clinics, invite users, impersonate staff, audit logs |
| **Manager** | Single clinic | Full child management, assign teachers, invite parents |
| **Staff** | Single clinic | Manage meetings, lesson planning, chat access |
| **Teacher** | Assigned children | View education plans, limited chat (read-focused) |
| **Parent** | Own children | Medical cards, documents, chat with care team |

### Data Isolation

Every query is clinic-scoped at the service layer:
- Manager from Clinic A **cannot** access Clinic B data
- Teachers only see children assigned to them
- Parents only see their own children
- Zero cross-clinic data leakage

---

## Key Features

### 1. Secure Impersonation System
Directors and managers can temporarily assume lower-privilege roles for troubleshooting or auditing, with full audit logging:
- Impersonation requires explicit clinic context
- All actions during impersonation are logged
- Access is automatically revoked on exit
- Original user ID preserved for accountability

### 2. AI-Powered Meeting Transcription
Therapy sessions can be recorded and automatically transcribed:
- Audio recording with real-time elapsed time display
- OpenAI Whisper API for transcription
- Claude AI for intelligent summarization
- Push notifications when processing completes
- Deep linking opens directly to meeting details

### 3. Parent Invitation Flow
Secure token-based system for linking parents to children:
- Manager initiates invitation with parent email
- 48-hour expiring secure token
- Parent creates account or links existing
- Maximum 2 parents per child enforced
- Relationship type captured (Mother/Father/Guardian)

### 4. Session Group Scheduling
Children attend therapy in locked session pairs:
- 5 session groups (G1-G5) with consistent weekly schedules
- Automatic capacity warnings at 6 children
- Teacher visibility derived from assigned children
- Type-safe at compile time

### 5. Multi-Discipline Lesson Planning
Weekly planning across 4 therapy disciplines:
- Education, Physiotherapy, Speech Therapy, Movement
- Teachers see only Education (role-filtered)
- Goals visible to parents for transparency
- Complete audit trail of changes

---

## Technical Highlights

### Authentication & Security
- **Supabase Auth** with email/password (Apple-compliant)
- **Deep linking** for password reset (`mmclinic://reset-password`)
- **Edge Functions** for secure user invitations (service role key never exposed to client)
- **Row-level security** on PostgreSQL tables

### State Management
- **React Context** for auth state with impersonation support
- **AsyncStorage** for session persistence
- **Service layer abstraction** for data access

### Navigation Architecture
```
AppNavigator
├── Unauthenticated Stack
│   ├── Login
│   ├── ForgotPassword
│   └── ResetPassword
├── Clinic Selection (if needed)
└── Role-Based Navigator
    ├── DirectorNavigator (5 tabs)
    ├── ManagerNavigator (6 tabs)
    ├── StaffNavigator (5 tabs)
    ├── TeacherNavigator (5 tabs)
    └── ParentNavigator (6 tabs)
```

### Performance Optimizations
- **Event-driven updates** for real-time data (80% reduction in polling)
- **Deep linking** from push notifications
- **Lazy loading** of navigation stacks
- **Optimistic UI updates** for responsiveness

---

## Challenges & Solutions

### Challenge 1: Complex Permission Logic
**Problem:** 5 user roles with intersecting but distinct permissions across 15+ features.

**Solution:** Implemented permission checks at the service layer rather than UI, ensuring consistent enforcement. Created a unified `effectiveRole` pattern in AuthContext that handles impersonation transparently.

### Challenge 2: Cross-Platform Push Notifications with Deep Linking
**Problem:** Users needed to tap a notification and land on the exact meeting with transcript.

**Solution:** Built a notification handler service that:
- Stores navigation ref from AppNavigator
- Parses notification payload for route + params
- Navigates through nested stacks to correct screen
- Triggers modal open with meeting data

### Challenge 3: Apple App Store Compliance
**Problem:** Apple requires account deletion, privacy policy, and specific permission descriptions.

**Solution:** 
- Implemented Edge Function for complete account deletion
- Added proper iOS Info.plist permission strings
- Created secure password reset flow with deep linking
- Ensured no plaintext sensitive data in logs

---

## Results & Impact

| Metric | Outcome |
|--------|---------|
| **User Roles** | 5 distinct roles with granular permissions |
| **Clinic Isolation** | 100% data separation between locations |
| **TypeScript Coverage** | Full type safety across 22 services |
| **App Store Ready** | Compliant with Apple privacy requirements |
| **Navigation Screens** | 43 screens across 5 role-based navigators |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native, Expo SDK 54 |
| **Language** | TypeScript |
| **Navigation** | React Navigation 7 |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) |
| **AI Integration** | OpenAI Whisper, Anthropic Claude |
| **Push Notifications** | Expo Notifications |
| **State** | React Context + AsyncStorage |

---

## What I Learned

1. **Role-based systems require service-layer enforcement** – UI-only permission checks lead to security gaps
2. **Impersonation is powerful but dangerous** – Explicit clinic context and audit logging are essential
3. **Deep linking complexity scales with navigation depth** – Having a centralized notification handler prevents bugs
4. **Edge Functions are ideal for sensitive operations** – Never expose service keys to the client
5. **Type safety pays dividends** – TypeScript caught dozens of potential runtime errors during development

---

*This project demonstrates my ability to architect and implement complex, production-ready mobile applications with enterprise-grade security, multi-tenant data isolation, and thoughtful UX for diverse user personas.*
