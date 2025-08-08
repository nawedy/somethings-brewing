📁 src/routes
├── +layout.svelte # Global layout (includes Header/Footer)
├── +page.svelte # Home
├── login
│ └── +page.svelte # User login form
├── register
│ └── +page.svelte # Account registration form
├── subscribe
│ └── +page.svelte # Newsletter or product subscription signup
├── account
│ ├── +layout.svelte # Customer account layout
│ ├── +page.svelte # Account overview
│ ├── orders
│ │ └── +page.svelte # Order history
│ ├── subscriptions
│ │ └── +page.svelte # Product subscriptions
│ └── settings
│ └── +page.svelte # Account settings
├── admin
│ ├── +layout.svelte # Admin panel layout
│ ├── +page.svelte # Dashboard overview
│ ├── products
│ │ └── +page.svelte # Product management
│ ├── blogs
│ │ └── +page.svelte # Blog post management
│ ├── orders
│ │ └── +page.svelte # Admin view of all orders
│ ├── affiliates
│ │ └── +page.svelte # Manage affiliates & payouts
│ └── analytics
│ └── +page.svelte # Event and performance tracking
├── affiliate
│ ├── +layout.svelte # Affiliate dashboard layout
│ ├── +page.svelte # Earnings overview
│ ├── links
│ │ └── +page.svelte # Referral link management
│ ├── referrals
│ │ └── +page.svelte # List of referred users
│ └── payouts
│ └── +page.svelte # Payout history

📁 src/components
├── AuthForm.svelte # Shared logic for login/register
├── DashboardCard.svelte # Stat tiles (revenue, orders, etc.)
├── OrderList.svelte # Reusable order listing
├── SubscriptionList.svelte # Reusable subscription component
├── ReferralTable.svelte # Affiliate referral data table
├── PayoutHistory.svelte # Affiliate payout view
├── ProductEditor.svelte # Admin product form
├── BlogEditor.svelte # Admin blog form
├── AnalyticsChart.svelte # Event analytics & charting
