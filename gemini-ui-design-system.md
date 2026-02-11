# 🎨 HRMS UI/UX DESIGN SYSTEM - COMPLETE PROMPT FOR ANTIGRAVITY

## 📋 Design Philosophy

Create a **modern, minimalist, professional HRMS interface** that is:
- Clean and uncluttered with generous whitespace
- Highly readable with clear visual hierarchy
- Mobile-first with seamless desktop scaling
- Accessible (WCAG 2.1 AA compliant)
- Emotionally intelligent and employee-friendly
- Unique and copyright-free

---

## 🎨 COLOR PALETTE (UNIQUE BRAND COLORS)

### Primary Colors
```css
--primary-main: #2D5BFF;        /* Vibrant blue for CTAs and primary actions */
--primary-light: #5B7FFF;       /* Lighter shade for hover states */
--primary-dark: #1A3ACC;        /* Darker shade for active states */
--primary-subtle: #E8EEFF;      /* Very light blue for backgrounds */
```

### Accent Colors (for different modules)
```css
--accent-attendance: #00C48C;   /* Green - positive, growth */
--accent-leaves: #FF6B35;       /* Coral - attention, warmth */
--accent-payroll: #8B5CF6;      /* Purple - premium, trust */
--accent-sales: #FBBF24;        /* Amber - achievement, energy */
--accent-team: #06B6D4;         /* Cyan - collaboration */
--accent-warning: #F59E0B;      /* Orange - caution */
--accent-error: #EF4444;        /* Red - errors */
--accent-success: #10B981;      /* Emerald - success */
```

### Neutral Palette
```css
--neutral-900: #0F1419;         /* Headings, primary text */
--neutral-700: #3E4852;         /* Body text */
--neutral-500: #6B7280;         /* Secondary text */
--neutral-300: #D1D5DB;         /* Borders, dividers */
--neutral-100: #F3F4F6;         /* Light backgrounds */
--neutral-50: #F9FAFB;          /* Subtle backgrounds */
--white: #FFFFFF;               /* Cards, modals */
```

### Background Gradients
```css
--gradient-primary: linear-gradient(135deg, #2D5BFF 0%, #5B7FFF 100%);
--gradient-success: linear-gradient(135deg, #00C48C 0%, #10B981 100%);
--gradient-warm: linear-gradient(135deg, #FF6B35 0%, #FBBF24 100%);
--gradient-subtle: linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%);
```

---

## 🔤 TYPOGRAPHY

### Font Family
```css
/* Primary Font (Headings, UI) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Secondary Font (Body, Data) */
font-family: 'Inter', system-ui, sans-serif;

/* Monospace (Codes, Numbers) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes & Weights
```css
/* Display (Hero text) */
--text-display: 48px / 56px; font-weight: 700;

/* H1 (Page titles) */
--text-h1: 32px / 40px; font-weight: 700;

/* H2 (Section headers) */
--text-h2: 24px / 32px; font-weight: 600;

/* H3 (Card headers) */
--text-h3: 20px / 28px; font-weight: 600;

/* H4 (Subsection headers) */
--text-h4: 18px / 26px; font-weight: 600;

/* Body Large */
--text-body-lg: 16px / 24px; font-weight: 400;

/* Body Regular */
--text-body: 14px / 20px; font-weight: 400;

/* Body Small */
--text-body-sm: 13px / 18px; font-weight: 400;

/* Caption */
--text-caption: 12px / 16px; font-weight: 500;

/* Label */
--text-label: 11px / 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
```

---

## 📐 SPACING SYSTEM

Use **8px base unit** for consistent spacing:

```css
--space-1: 4px;    /* Micro spacing */
--space-2: 8px;    /* Tight spacing */
--space-3: 12px;   /* Small spacing */
--space-4: 16px;   /* Base spacing */
--space-5: 20px;   /* Medium spacing */
--space-6: 24px;   /* Large spacing */
--space-8: 32px;   /* XL spacing */
--space-10: 40px;  /* 2XL spacing */
--space-12: 48px;  /* 3XL spacing */
--space-16: 64px;  /* Section spacing */
--space-20: 80px;  /* Page spacing */
```

---

## 🎯 COMPONENT DESIGN SPECIFICATIONS

### 1. BUTTONS

#### Primary Button
```css
background: var(--gradient-primary);
border-radius: 12px;
padding: 14px 24px;
font-size: 16px;
font-weight: 600;
color: white;
box-shadow: 0 4px 12px rgba(45, 91, 255, 0.24);
transition: all 0.2s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(45, 91, 255, 0.32);

/* Active */
transform: translateY(0);
box-shadow: 0 2px 8px rgba(45, 91, 255, 0.16);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

#### Secondary Button
```css
background: white;
border: 2px solid var(--neutral-300);
border-radius: 12px;
padding: 14px 24px;
font-size: 16px;
font-weight: 600;
color: var(--neutral-700);
transition: all 0.2s ease;

/* Hover */
border-color: var(--primary-main);
color: var(--primary-main);
background: var(--primary-subtle);
```

#### Icon Button
```css
width: 44px;
height: 44px;
border-radius: 50%;
background: var(--neutral-100);
display: flex;
align-items: center;
justify-content: center;
transition: all 0.2s ease;

/* Hover */
background: var(--primary-main);
color: white;
```

### 2. CARDS

#### Standard Card
```css
background: white;
border-radius: 16px;
padding: 20px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
border: 1px solid var(--neutral-100);
transition: all 0.2s ease;

/* Hover (for clickable cards) */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
transform: translateY(-2px);
```

#### Stat Card
```css
background: var(--gradient-subtle);
border-radius: 20px;
padding: 24px;
border: 1px solid var(--neutral-100);
position: relative;
overflow: hidden;

/* Decorative element */
&::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: var(--primary-main);
  opacity: 0.05;
  border-radius: 50%;
}
```

#### Module Card (with icon)
```css
/* Container */
background: white;
border-radius: 20px;
padding: 20px;
text-align: center;

/* Icon Container */
width: 64px;
height: 64px;
border-radius: 16px;
background: var(--gradient-primary);
margin: 0 auto 12px;
display: flex;
align-items: center;
justify-content: center;

/* Icon */
font-size: 28px;
color: white;

/* Label */
font-size: 14px;
font-weight: 600;
color: var(--neutral-700);
margin-top: 8px;

/* Badge (for counts) */
position: absolute;
top: -8px;
right: -8px;
background: var(--accent-error);
color: white;
width: 24px;
height: 24px;
border-radius: 50%;
font-size: 11px;
font-weight: 700;
```

### 3. INPUT FIELDS

```css
/* Container */
margin-bottom: 20px;

/* Label */
font-size: 13px;
font-weight: 600;
color: var(--neutral-700);
margin-bottom: 8px;
display: block;

/* Input */
width: 100%;
padding: 14px 16px;
background: var(--neutral-50);
border: 2px solid transparent;
border-radius: 12px;
font-size: 15px;
color: var(--neutral-900);
transition: all 0.2s ease;

/* Focus */
background: white;
border-color: var(--primary-main);
box-shadow: 0 0 0 4px var(--primary-subtle);

/* Error */
border-color: var(--accent-error);
background: rgba(239, 68, 68, 0.05);

/* Helper text */
font-size: 12px;
color: var(--neutral-500);
margin-top: 6px;
```

### 4. NAVIGATION

#### Bottom Navigation (Mobile)
```css
position: fixed;
bottom: 0;
left: 0;
right: 0;
background: white;
padding: 12px 20px 20px;
border-top: 1px solid var(--neutral-100);
display: flex;
justify-content: space-around;
align-items: center;
z-index: 100;
box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.04);

/* Nav Item */
display: flex;
flex-direction: column;
align-items: center;
gap: 4px;
padding: 8px 12px;
border-radius: 12px;
transition: all 0.2s ease;

/* Icon */
font-size: 24px;
color: var(--neutral-500);

/* Label */
font-size: 11px;
font-weight: 600;
color: var(--neutral-500);

/* Active State */
background: var(--primary-subtle);
icon-color: var(--primary-main);
label-color: var(--primary-main);
```

#### Top App Bar (Mobile)
```css
position: fixed;
top: 0;
left: 0;
right: 0;
height: 60px;
background: white;
padding: 0 20px;
display: flex;
align-items: center;
justify-content: space-between;
border-bottom: 1px solid var(--neutral-100);
z-index: 100;

/* Title */
font-size: 18px;
font-weight: 700;
color: var(--neutral-900);

/* Actions */
display: flex;
gap: 8px;
```

#### Sidebar (Desktop)
```css
width: 280px;
height: 100vh;
background: var(--neutral-900);
padding: 24px 16px;
position: fixed;
left: 0;
top: 0;

/* Logo */
margin-bottom: 32px;

/* Nav Item */
display: flex;
align-items: center;
gap: 12px;
padding: 12px 16px;
border-radius: 12px;
color: rgba(255, 255, 255, 0.7);
font-size: 14px;
font-weight: 500;
transition: all 0.2s ease;
margin-bottom: 4px;

/* Hover */
background: rgba(255, 255, 255, 0.08);
color: white;

/* Active */
background: var(--primary-main);
color: white;
```

### 5. BADGES & CHIPS

#### Status Badge
```css
display: inline-flex;
align-items: center;
gap: 6px;
padding: 6px 12px;
border-radius: 20px;
font-size: 12px;
font-weight: 600;

/* Success */
background: rgba(16, 185, 129, 0.1);
color: #059669;

/* Warning */
background: rgba(245, 158, 11, 0.1);
color: #D97706;

/* Error */
background: rgba(239, 68, 68, 0.1);
color: #DC2626;

/* Info */
background: rgba(45, 91, 255, 0.1);
color: var(--primary-main);

/* Dot indicator */
width: 6px;
height: 6px;
border-radius: 50%;
background: currentColor;
```

### 6. MODALS & DIALOGS

```css
/* Overlay */
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
z-index: 1000;

/* Modal Container */
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
max-width: 480px;
width: 90%;
background: white;
border-radius: 24px;
padding: 28px;
box-shadow: 0 24px 48px rgba(0, 0, 0, 0.16);

/* Header */
margin-bottom: 20px;

/* Title */
font-size: 22px;
font-weight: 700;
color: var(--neutral-900);

/* Content */
font-size: 15px;
color: var(--neutral-700);
line-height: 1.6;
margin-bottom: 24px;

/* Actions */
display: flex;
gap: 12px;
justify-content: flex-end;
```

---

## 📱 SCREEN LAYOUTS

### 1. SPLASH SCREEN
```
[Full screen gradient background]
  [Center-aligned logo - 120px]
  [App name - 28px, bold]
  [Tagline - 14px, light]
  [Loading indicator - bottom 80px]
```

### 2. ONBOARDING SCREENS (3 slides)
```
[Hero illustration - top 40%]
[Title - 24px, bold, center]
[Description - 15px, center, max-width: 280px]
[Pagination dots - center]
[Primary button - "Next" / "Get Started"]
[Skip button - top right, ghost]
```

### 3. LOGIN / SIGNUP
```
[Top safe area - 60px]
[Logo - 80px, center]
[Welcome message - 24px, bold]
[Subtext - 14px, gray]

[Form container]
  [Email input]
  [Password input with show/hide]
  [Forgot password - right aligned]
  
[Primary button - "Sign In"]
[Divider with "or"]
[Social login buttons]
[Bottom text: "Don't have account? Sign Up"]
```

### 4. HOME DASHBOARD (Mobile)
```
[App bar: avatar-left, notification-right, title-center]

[Greeting card with gradient]
  "Good Morning, John"
  [Today's date]
  [Quick action button]

[Stats row - 2 columns]
  [Present days card]
  [Leave balance card]

[Quick Actions Grid - 2x2 or 3x2]
  [Check In/Out]
  [Apply Leave]
  [View Payslip]
  [Expenses]
  [Team]
  [Documents]

[Recent Activities section]
  [Activity card 1]
  [Activity card 2]
  [See all]

[Bottom navigation - 5 items]
```

### 5. CHECK-IN SCREEN
```
[Large digital clock - center, 80px]
[Date - 16px, center]

[Location card]
  [Map pin icon]
  [Office location]
  [Distance from office]

[Large primary button - "Check In"]

[Bottom info]
  [Location tracking status]
  [Office network detected]
```

### 6. LEAVE APPLICATION
```
[App bar: back, "Apply Leave"]

[Leave type selector - horizontal scroll]
  [PL card]
  [SL card]
  [CL card]

[Balance display card]
  "18 days available"

[Form]
  [From date picker]
  [To date picker]
  [Total days - auto-calculated, read-only]
  [Half day toggle]
  [Reason - textarea]
  
[Submit button]
```

### 7. ATTENDANCE HISTORY
```
[App bar with date range selector]

[Calendar view - month]
  [Color-coded days]
  Green - Present
  Orange - Late
  Red - Absent
  Blue - Leave
  Gray - Weekend/Holiday

[Statistics cards row]
  [Present: 22]
  [Late: 2]
  [Absent: 0]
  [On Leave: 1]

[List view toggle]
[Detailed list of attendance]
```

### 8. PAYSLIP
```
[App bar: back, "Payslip", download]

[Month/Year selector]

[Top summary card - gradient]
  "Net Pay"
  ₹65,450
  [View breakdown]

[Earnings section]
  [Basic - ₹40,000]
  [HRA - ₹16,000]
  [Special - ₹20,000]
  [Incentive - ₹5,000]
  
[Deductions section]
  [PF - ₹4,800]
  [PT - ₹200]
  [TDS - ₹10,550]

[Download PDF button]
```

### 9. PROFILE
```
[Cover image with gradient]
  [Avatar - 100px, center, with edit button]

[Name - 24px, center]
[Role - 14px, center, gray]
[Employee code - 12px]

[Info cards grid]
  [Email card]
  [Phone card]
  [Department card]
  [Joining date card]

[Menu list]
  [Edit Profile]
  [Change Password]
  [Notification Settings]
  [Language]
  [Privacy Policy]
  [Terms & Conditions]
  [Logout]
```

### 10. TEAM VIEW
```
[App bar: back, "Team", search]

[Department filter chips]

[Team member cards]
  [Avatar - 48px]
  [Name - 16px]
  [Role - 13px, gray]
  [Status badge - online/offline]
  [Action buttons: chat, call]

[Floating action button - "+ Add Member"]
```

### 11. NOTIFICATIONS
```
[App bar: back, "Notifications", mark all read]

[Today section]
  [Notification card]
    [Icon with colored background]
    [Title - 15px, bold]
    [Message - 13px]
    [Time - 12px, gray]
    [Unread dot]

[Yesterday section]
  [...]

[This Week section]
  [...]
```

### 12. SALES INCENTIVE APPROVAL (Manager)
```
[App bar: "Pending Approvals", filter]

[Incentive card]
  [Employee avatar + name]
  [Deal name]
  [Deal value - large]
  [Commission percentage]
  [Calculated amount - highlighted]
  
  [Action buttons row]
    [Approve - green]
    [Override - orange]
    [Reject - red]
```

---

## 🎭 ANIMATIONS & TRANSITIONS

### Micro-interactions
```css
/* Button press */
transition: transform 0.1s ease;
active: transform: scale(0.96);

/* Card hover */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
hover: transform: translateY(-4px);

/* Page transition */
slide-in: transform: translateX(100%) to translateX(0);
slide-out: transform: translateX(0) to translateX(-30%);
duration: 300ms;
easing: cubic-bezier(0.4, 0, 0.2, 1);

/* Skeleton loading */
shimmer animation with gradient overlay
```

### Loading States
```
- Skeleton screens for lists
- Spinner for quick actions
- Progress bar for uploads
- Pulse animation for loading cards
```

---

## 📐 RESPONSIVE BREAKPOINTS

```css
/* Mobile */
@media (max-width: 640px) {
  /* Full-width layouts */
  /* Bottom navigation */
  /* Single column grids */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 2-column grids */
  /* Side navigation option */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Sidebar navigation */
  /* 3-4 column grids */
  /* Max content width: 1440px */
  /* Side panels for details */
}
```

---

## 🎨 ICON SYSTEM

Use **Lucide React** icons with consistent sizing:

```css
/* Small icons */
16px - For inline text, badges

/* Medium icons */
20px - For buttons, inputs

/* Large icons */
24px - For navigation, headers

/* XL icons */
32px - For module cards

/* 2XL icons */
48px - For empty states

/* Stroke width */
2px - Standard
2.5px - Bold (for emphasis)
```

### Icon Color System
```css
/* Default */
color: var(--neutral-500);

/* Active */
color: var(--primary-main);

/* On colored background */
color: white;

/* Success */
color: var(--accent-success);

/* Warning */
color: var(--accent-warning);

/* Error */
color: var(--accent-error);
```

---

## 🌈 ILLUSTRATIONS & EMPTY STATES

### Illustration Style
- Flat design with subtle shadows
- 2-3 colors maximum per illustration
- Simple, geometric shapes
- Relatable human characters (diverse, inclusive)
- Warm, friendly expressions
- Modern office/work settings

### Empty State Components
```
[Large icon - 80px, light gray]
[Title - 18px, "No data yet"]
[Description - 14px, helpful text]
[Primary action button]
```

---

## ✅ UNIQUE DESIGN DIFFERENTIATORS

To make this design truly unique:

1. **Custom Card Shapes**: Use asymmetric corners (e.g., top-left 20px, others 12px)
2. **Gradient Accents**: Subtle gradients on module cards
3. **Depth System**: Consistent 3-level shadow system
4. **Custom Icons**: Design custom icons for main modules
5. **Unique Number Display**: Custom font for statistics
6. **Interactive States**: Smooth, spring-based animations
7. **Dark Mode**: Complete dark theme with adjusted colors
8. **Glassmorphism**: Frosted glass effect on overlays
9. **Neumorphism**: Subtle depth on certain cards
10. **Custom Illustrations**: Commissioned or created in-house

---

## 🔧 IMPLEMENTATION CHECKLIST

### Phase 1: Design System Setup
- [ ] Create color palette variables
- [ ] Set up typography scale
- [ ] Define spacing system
- [ ] Create component library in Figma
- [ ] Build Tailwind config

### Phase 2: Core Components
- [ ] Button variants (8 types)
- [ ] Input fields (5 types)
- [ ] Cards (6 types)
- [ ] Navigation (mobile + desktop)
- [ ] Modals & dialogs

### Phase 3: Screen Templates
- [ ] Authentication flows (6 screens)
- [ ] Home dashboard (3 variants)
- [ ] Attendance module (5 screens)
- [ ] Leave module (6 screens)
- [ ] Payroll module (4 screens)
- [ ] Sales module (5 screens)
- [ ] Profile & settings (8 screens)

### Phase 4: Interactions
- [ ] Page transitions
- [ ] Button animations
- [ ] Loading states
- [ ] Success/error feedback
- [ ] Pull to refresh

### Phase 5: Accessibility
- [ ] Color contrast (AAA rating)
- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Focus indicators
- [ ] Touch target sizes (44x44px minimum)

---

## 🎯 FINAL NOTES FOR ANTIGRAVITY

When building in Antigravity IDE:

1. **Start with Design Tokens**: Define all variables first
2. **Component-First**: Build reusable components before screens
3. **Mobile-First CSS**: Write mobile styles first, then scale up
4. **Use Tailwind Classes**: Leverage utility classes for speed
5. **Atomic Design**: Atoms → Molecules → Organisms → Templates
6. **Test on Real Devices**: Don't rely only on emulators
7. **Performance**: Optimize images, lazy load components
8. **Dark Mode**: Consider from day one, not as afterthought

---

## 📚 INSPIRATION REFERENCES (For Unique Ideas)

Look at (but don't copy):
- Apple Human Interface Guidelines (spacing, hierarchy)
- Material Design 3 (motion, accessibility)
- Stripe Dashboard (data visualization)
- Linear (keyboard shortcuts, interactions)
- Notion (flexible layouts, tables)

---

**This design system will create a unique, modern, accessible HRMS that users will love! 🚀**

