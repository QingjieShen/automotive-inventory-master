# Account Page Feature

## Overview
Added a new account page where users can view their profile information and log out of the application.

## Features

### Account Page (`/account`)
- **User Profile Display**
  - User name and email
  - Role badge with color coding:
    - Super Admin: Purple
    - Admin: Blue
    - Photographer: Green
  - Role description explaining permissions
  - Current store information (if selected)
  - User ID (for support purposes)

- **Logout Functionality**
  - Prominent logout button
  - Loading state during logout
  - Redirects to login page after logout

- **Navigation**
  - Back to Vehicles button (when store is selected)
  - Select a Store button (when no store is selected)
  - Integrated with NavigationBanner

### Navigation Banner Updates
- Added "Account" button to navigation bar
- Available on both desktop and mobile views
- Positioned before "Manage Stores" and "Back to Stores" buttons

## User Experience

### Desktop View
```
[MMG Logo]  [Store Name]  [Account] [Manage Stores*] [Back to Stores]
```
*Only visible to Super Admins

### Mobile View
- Hamburger menu includes:
  - Account link
  - Manage Stores (Super Admin only)
  - Back to Stores

### Account Page Layout
1. **Header Section**
   - Gradient background (blue)
   - User avatar icon
   - User name and email

2. **Profile Details Section**
   - Email address with icon
   - Role badge with description
   - Current store information
   - User ID (small text)

3. **Actions Section**
   - Logout button (red, prominent)
   - Navigation buttons (gray)

4. **Help Section**
   - Information about contacting administrator

## Technical Implementation

### Files Created
1. `src/app/account/page.tsx` - Account page component
2. `tests/unit/account-page.test.tsx` - Unit tests

### Files Modified
1. `src/components/common/NavigationBanner.tsx` - Added Account button

### Key Components Used
- `useSession` from next-auth/react - Get user session
- `signOut` from next-auth/react - Handle logout
- `useRouter` from next/navigation - Navigation
- `ProtectedRoute` - Ensure authentication
- `NavigationBanner` - Consistent navigation
- Heroicons - UI icons

### Authentication Flow
1. User clicks "Account" in navigation
2. Page checks authentication status
3. If not authenticated → redirect to login
4. If authenticated → display profile
5. User clicks "Log Out"
6. `signOut` is called with redirect to login
7. Session is cleared
8. User is redirected to login page

## Role-Based Display

### Photographer
- Role: "Photographer"
- Description: "Can upload and manage vehicle photos"
- Access: Basic vehicle photo management

### Admin
- Role: "Admin"
- Description: "Can manage vehicles, delete, and reprocess images"
- Access: Full vehicle management + deletion + reprocessing

### Super Admin
- Role: "Super Admin"
- Description: "Full system access including store management"
- Access: Everything + store management

## Responsive Design
- Desktop: Full layout with side-by-side sections
- Tablet: Adjusted spacing
- Mobile: Stacked layout, full-width buttons

## Accessibility
- Proper heading hierarchy (h1, h2, h3)
- ARIA labels on buttons
- Keyboard navigation support
- Color contrast meets WCAG AA standards
- Screen reader friendly

## Security
- Protected route (requires authentication)
- Session validation
- Secure logout process
- No sensitive data exposed

## Testing
Unit tests cover:
- ✅ Renders account page with user information
- ✅ Displays user role correctly
- ✅ Displays current store information
- ✅ Different role badges for different roles
- ✅ Logout button calls signOut
- ✅ Logout button shows loading state
- ✅ Navigation buttons work correctly
- ✅ Redirects to login if not authenticated
- ✅ Shows loading spinner while session loads
- ✅ Displays user ID for support
- ✅ Shows help information
- ✅ Navigation banner is rendered

## Usage

### For Users
1. Click "Account" in the navigation bar
2. View your profile information
3. Click "Log Out" to sign out

### For Developers
```typescript
// Navigate to account page
router.push('/account')

// The page is protected and will redirect if not authenticated
// Session data is automatically loaded from NextAuth
```

## Future Enhancements
Possible additions:
- Password change functionality
- Profile picture upload
- Email preferences
- Notification settings
- Activity log
- Two-factor authentication setup
