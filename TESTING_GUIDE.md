# Harmonization Module - Testing Guide

## Quick Start Testing

### Prerequisites
1. Ensure you have valid authentication token
2. Access to one of the authorized roles:
   - ACCOUNT-APPROVER
   - CLIENT-ADMIN
   - ACCOUNT-CREATOR
3. Valid account number for testing
4. Phone number associated with account for OTP

### Test Data Requirements
- **Account Number**: 10-16 digit numeric string
- **Phone Number**: Registered with the account
- **National ID**: Fayda account credentials

## Test Scenarios

### 1. Menu Visibility & Navigation

**Test Case 1.1: Menu Item Visible for Authorized Roles**
```
Steps:
1. Log in as ACCOUNT-APPROVER user
2. Check sidebar menu
Expected: "Harmonization" menu item is visible with Shuffle icon

Repeat for:
- CLIENT-ADMIN user
- ACCOUNT-CREATOR user
```

**Test Case 1.2: Menu Item Hidden for Unauthorized Roles**
```
Steps:
1. Log in as SUPER-ADMIN user
2. Check sidebar menu
Expected: "Harmonization" menu item is NOT visible

Repeat for other unauthorized roles
```

**Test Case 1.3: Route Navigation**
```
Steps:
1. Click "Harmonization" menu item
Expected: Navigate to /harmonization route
Expected: List page loads successfully
```

### 2. List Page

**Test Case 2.1: Initial Load**
```
Steps:
1. Navigate to /harmonization
Expected:
- Page title "Harmonization" displays
- "Create Harmonization" button visible (cyan color)
- Table loads with columns
- Loading skeleton shows during fetch
```

**Test Case 2.2: Empty State**
```
Steps:
1. Navigate to /harmonization (with no data)
Expected:
- Empty table message displays
- No errors shown
```

**Test Case 2.3: Data Display**
```
Steps:
1. Navigate to /harmonization (with data)
Expected:
- All columns display correctly:
  - Account Number
  - Phone Number
  - Status (with badge)
  - Account Title
  - Gender
  - Date of Birth
  - Created At
- Status badges show correct colors:
  - PENDING_OTP: Yellow/secondary
  - OTP_VERIFIED: Green/default
```

**Test Case 2.4: Table Features**
```
Steps:
1. Test sorting on each column
2. Test search by account number
Expected:
- All sortable columns work
- Search filters data correctly
```

### 3. Create Harmonization - Step 1 (OTP)

**Test Case 3.1: Open Modal**
```
Steps:
1. Click "Create Harmonization" button
Expected:
- Modal opens
- Stepper shows Step 1 active (cyan)
- Steps 2 and 3 inactive (gray)
- Account number input field visible
```

**Test Case 3.2: Account Number Validation**
```
Invalid Inputs:
- Empty string → "Please enter an account number"
- "abc123" → "Account number must contain only digits"
- "123" → "Account number must be at least 10 digits"

Valid Input:
- "1022200133452" → No error
```

**Test Case 3.3: Send OTP**
```
Steps:
1. Enter valid account number
2. Click "Send OTP"
Expected:
- Button shows loading spinner
- Button disabled during request
- Success: Masked phone number displays
- Success: OTP input field appears
- Success: Toast shows success message
```

**Test Case 3.4: OTP Validation**
```
Invalid Inputs:
- Empty → "Please enter the OTP code"
- "123" → "OTP code must be 6 digits"
- "abc123" → Only allows numeric input

Valid Input:
- "451358" → No error
```

**Test Case 3.5: Verify OTP**
```
Steps:
1. Enter valid 6-digit OTP
2. Click "Verify OTP"
Expected:
- Button shows loading spinner
- Success: Toast shows "OTP verified successfully"
- Success: Advances to Step 2
- Error: Toast shows error message
- Error: Remains on Step 1
```

**Test Case 3.6: Resend OTP**
```
Steps:
1. After OTP sent, click "Resend OTP"
Expected:
- OTP sent again
- New OTP code generated
- Toast notification shown
```

### 4. Create Harmonization - Step 2 (Fayda)

**Test Case 4.1: Consent Screen**
```
Steps:
1. Verify OTP successfully
Expected:
- Step 2 active in stepper
- Title: "National ID Verification Required"
- Description text displays
- Benefits card with 4 checkmarks
- Consent checkbox unchecked
- "Continue with National ID" button disabled
```

**Test Case 4.2: Consent Validation**
```
Steps:
1. Try clicking "Continue" without checking consent
Expected: Toast error "Please accept the consent to continue"

Steps:
1. Check consent checkbox
Expected: "Continue with National ID" button enabled
```

**Test Case 4.3: WebSocket Connection**
```
Steps:
1. Check consent
2. Click "Continue with National ID"
Expected:
- Button shows loading spinner
- WebSocket connects (check console)
- Client registration message sent
- Fayda URL fetched
- Popup window opens
```

**Test Case 4.4: Popup Blocker Detection**
```
Steps:
1. Enable popup blocker in browser
2. Click "Continue with National ID"
Expected:
- Toast error "Popup blocked! Please allow popups for this site."
- Instructions to enable popups
- WebSocket disconnects
```

**Test Case 4.5: WebSocket Timeout**
```
Steps:
1. Disconnect network
2. Click "Continue with National ID"
Expected:
- After 10 seconds: "WebSocket connection timeout" error
- Returns to consent screen
```

**Test Case 4.6: Authentication in Popup**
```
Steps:
1. Complete authentication in popup
2. Close popup after success
Expected:
- Main window shows "Waiting for authentication..."
- WebSocket receives authentication_result
- Fayda data displays in cards
- Profile picture shows
- Continue button appears
```

**Test Case 4.7: Authentication Timeout**
```
Steps:
1. Open popup but don't authenticate
2. Wait 5 minutes
Expected:
- "Authentication timeout. Please try again." error
- Returns to consent screen
- WebSocket disconnects
```

**Test Case 4.8: Fayda Data Display**
```
Expected Fields:
- Profile picture (circle, cyan border)
- Full Name (with User icon)
- Gender (with User icon)
- Date of Birth (with Calendar icon)
- Phone Number (with Phone icon)
- Region (with MapPin icon)
All in card format
```

**Test Case 4.9: Back Button**
```
Steps:
1. Click "Back" button
Expected:
- Returns to Step 1
- Previous data preserved
```

### 5. Create Harmonization - Step 3 (Review)

**Test Case 5.1: Layout**
```
Expected:
- Step 3 active in stepper
- Title: "Review & Harmonize"
- Two-column grid layout
- Left: National ID (Fayda) data (cyan border)
- Right: Bank Account data (blue border)
```

**Test Case 5.2: Data Comparison**
```
Left Column (Fayda):
- Profile picture
- Name
- Gender
- Date of Birth
- Phone Number
- Region

Right Column (Bank):
- Account Number
- Account Title
- Phone Number
- Address
- Gender
- Date of Birth

Expected: All fields populated correctly
```

**Test Case 5.3: Missing Data Handling**
```
Steps:
1. Return to Step 3 without completing previous steps
Expected:
- Error message displays
- "Missing required data. Please go back and try again."
- "Go Back" button available
```

**Test Case 5.4: Submit Harmonization**
```
Steps:
1. Click "Harmonize" button
Expected:
- Button shows loading spinner
- Button disabled during request
- FormData constructed with all fields
- Picture converted from base64 to Blob
- Success: Toast "Harmonization completed successfully"
- Success: Modal closes
- Success: List page refreshes
- Error: Toast shows error message
- Error: Remains on Step 3
```

**Test Case 5.5: Back Button**
```
Steps:
1. Click "Back" button
Expected:
- Returns to Step 2
- Fayda data preserved
```

### 6. Error Scenarios

**Test Case 6.1: Network Error**
```
Steps:
1. Disconnect network
2. Try any API operation
Expected:
- Toast error message
- Graceful error handling
- No application crash
```

**Test Case 6.2: Invalid API Response**
```
Steps:
1. Use invalid account number
2. Send OTP
Expected:
- API error message in toast
- User can retry
```

**Test Case 6.3: WebSocket Disconnection**
```
Steps:
1. Start authentication
2. Disconnect network
Expected:
- Auto-reconnection attempts (max 5)
- Error message if all attempts fail
- User can restart process
```

**Test Case 6.4: Expired Token**
```
Steps:
1. Use expired authentication token
2. Try any operation
Expected:
- 401 error caught
- User redirected to login
```

### 7. WebSocket Testing

**Test Case 7.1: Connection**
```
Steps:
1. Open browser console
2. Start Step 2
Expected:
- Console log: "WebSocket connected"
- WebSocket URL: wss://coopengage.coopbankoromiasc.com/ws/fayda
```

**Test Case 7.2: Message Registration**
```
Steps:
1. After connection, check console
Expected:
- Console log: "WebSocket message sent"
- Message: { type: "register_client", clientId: "..." }
```

**Test Case 7.3: Message Reception**
```
Steps:
1. Complete authentication in popup
Expected:
- Console log: "WebSocket message received"
- Message type: "authentication_result"
- Message contains data object
```

**Test Case 7.4: Cleanup**
```
Steps:
1. Close modal during Step 2
Expected:
- WebSocket disconnects
- No memory leaks
- Console log: "WebSocket closed"
```

### 8. UI/UX Testing

**Test Case 8.1: Loading States**
```
All buttons should:
- Show spinner during loading
- Be disabled during loading
- Return to normal after operation
```

**Test Case 8.2: Stepper UI**
```
Expected:
- Active step: Cyan circle with white number
- Completed step: Green circle with checkmark
- Inactive step: Gray circle with number
- Line between steps changes color
```

**Test Case 8.3: Responsive Design**
```
Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Expected:
- Two-column layout stacks on mobile
- Modal fits screen
- Buttons remain accessible
```

**Test Case 8.4: Accessibility**
```
Test:
- Tab navigation through form
- Enter key submits forms
- Esc key closes modal
- Labels associated with inputs
```

### 9. Performance Testing

**Test Case 9.1: Large Dataset**
```
Steps:
1. Load list with 100+ harmonizations
Expected:
- Table loads smoothly
- Sorting works quickly
- No lag in UI
```

**Test Case 9.2: Image Loading**
```
Steps:
1. Complete flow with large profile picture
Expected:
- Image loads without blocking UI
- Image converts to Blob successfully
- Upload completes without timeout
```

### 10. Security Testing

**Test Case 10.1: Token Required**
```
Steps:
1. Remove authentication token
2. Try accessing /harmonization
Expected:
- Redirect to login page
```

**Test Case 10.2: Role Required**
```
Steps:
1. Login as unauthorized role
2. Try accessing /harmonization
Expected:
- Menu item not visible
- Direct URL access denied or shows empty content
```

**Test Case 10.3: XSS Prevention**
```
Steps:
1. Enter <script>alert('xss')</script> in inputs
Expected:
- Script does not execute
- Input sanitized
```

## Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: ___________

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1.1       | ☐ Pass ☐ Fail | |
| 1.2       | ☐ Pass ☐ Fail | |
| 1.3       | ☐ Pass ☐ Fail | |
| ...       | ...    | ...   |

Critical Issues:
1. 
2. 
3. 

Minor Issues:
1. 
2. 
3. 

Recommendations:
1. 
2. 
3. 
```

## Automated Testing Suggestions

### Unit Tests
```typescript
// Example test structure
describe('Step1OTP', () => {
  it('validates account number format', () => {
    // Test validation logic
  });
  
  it('sends OTP when valid account number entered', () => {
    // Mock API call
    // Verify OTP sent
  });
  
  it('shows error for invalid OTP', () => {
    // Test error handling
  });
});
```

### Integration Tests
```typescript
describe('Harmonization Flow', () => {
  it('completes full harmonization process', () => {
    // Navigate to page
    // Click create button
    // Fill Step 1
    // Complete Step 2 (mock WebSocket)
    // Submit Step 3
    // Verify success
  });
});
```

## Browser Compatibility Testing

Test on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Known Limitations

1. **Popup Blockers**: Users must allow popups
2. **WebSocket**: Requires stable internet connection
3. **Mobile**: Popup flow may need adjustment for mobile browsers
4. **Timeout**: 5-minute authentication timeout is fixed

## Support & Troubleshooting

If tests fail, check:
1. API endpoints are accessible
2. WebSocket URL is correct
3. Authentication token is valid
4. User has correct role
5. Network connection is stable
6. Browser allows popups
7. Console for error messages

---

**Testing Status**: Ready for comprehensive testing  
**Estimated Testing Time**: 2-3 hours for full coverage  
**Priority**: High - Production deployment dependent


