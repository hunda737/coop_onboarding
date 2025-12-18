# Harmonization Module - Implementation Documentation

## Overview
The Harmonization module allows users to link their bank accounts with their National ID (Fayda) data through a secure 3-step verification process.

## Features
- ✅ Role-based access control (RBAC)
- ✅ OTP verification via SMS
- ✅ National ID (Fayda) verification via WebSocket
- ✅ Real-time data synchronization
- ✅ Secure popup-based authentication
- ✅ Comprehensive error handling

## Architecture

### File Structure
```
src/
├── features/harmonization/
│   └── harmonizationApiSlice.ts         # RTK Query API endpoints
├── lib/
│   └── websocketManager.ts              # WebSocket singleton manager
├── hooks/
│   └── use-harmonization-modal.tsx      # Zustand state management
├── pages/client/
│   └── Harmonization.tsx                # Page wrapper
├── components/
│   ├── container/clients/
│   │   └── HarmonizationContainer.tsx   # Data fetching container
│   ├── presentation/clients/
│   │   ├── HarmonizationPresentation.tsx
│   │   └── components/harmonization/
│   │       └── harmonization-columns.tsx # Table columns definition
│   └── ui/modals/
│       ├── harmonization-modal.tsx       # Main wizard modal
│       └── harmonization/
│           ├── Step1OTP.tsx              # OTP verification step
│           ├── Step2Fayda.tsx            # Fayda authentication step
│           ├── Step3Review.tsx           # Review & submit step
│           └── utils.ts                  # Utility functions
```

## User Flow

### Step 1: OTP Verification
1. User enters account number
2. System sends OTP to registered phone number
3. User enters 6-digit OTP code
4. System verifies OTP and retrieves account data

### Step 2: National ID (Fayda) Verification
1. User reads and accepts consent
2. System establishes WebSocket connection
3. Popup window opens for Fayda authentication
4. User authenticates with Fayda credentials
5. System receives verification data via WebSocket
6. User reviews retrieved National ID information

### Step 3: Review & Harmonize
1. User reviews side-by-side comparison:
   - Left: National ID (Fayda) data
   - Right: Bank account data
2. User confirms and submits harmonization
3. System processes and saves harmonization
4. User redirected to harmonization list

## API Endpoints

### 1. Get Harmonizations
```http
GET /api/v1/harmonization
Authorization: Bearer <token>
```

### 2. Send OTP
```http
POST /api/v1/harmonization/get-phone
Content-Type: application/json

{
  "accountNumber": "1022200133452"
}
```

### 3. Verify OTP
```http
POST /api/v1/harmonization/verify-otp
Content-Type: application/json

{
  "accountNumber": "1000026595928",
  "harmonizationRequestId": 2,
  "otpCode": "451358"
}
```

### 4. Get Fayda URL
```http
GET /api/v1/national/get-url?clientId=1234476
Authorization: Bearer <token>
```

### 5. Save Fayda Data
```http
POST /api/v1/harmonization/save-fayda-data
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields:
- phoneNumber
- email
- familyName
- name
- givenName
- sub
- picture (file)
- birthdate
- gender
- addressStreetAddress
- addressLocality
- addressRegion
- addressPostalCode
- addressCountry
- harmonizationRequestId
```

## WebSocket Communication

### Connection
```
wss://coopengage.coopbankoromiasc.com/ws/fayda
```

### Register Client
```json
{
  "type": "register_client",
  "clientId": "1234476"
}
```

### Receive Authentication Result
```json
{
  "type": "authentication_result",
  "clientId": "787989",
  "data": {
    "sub": "...",
    "name": "Gemechu Bulti Firissa",
    "phone_number": "0947539988",
    "picture": "data:image/jpeg;base64,...",
    "birthdate": "1998/02/04",
    "gender": "Male",
    "address": {
      "region": "Addis Ababa"
    }
  }
}
```

## Role-Based Access Control

The harmonization menu is visible to the following roles:
- `ACCOUNT-APPROVER`
- `CLIENT-ADMIN`
- `ACCOUNT-CREATOR`

## Security Features

1. **Token-Based Authentication**: All API requests require Bearer token
2. **OTP Verification**: 6-digit OTP sent to registered phone number
3. **Secure WebSocket**: WSS (WebSocket Secure) connection
4. **Popup Authentication**: User-triggered popup prevents automated attacks
5. **Session Timeout**: 5-minute timeout for authentication process
6. **Data Validation**: Input validation on both client and server

## Error Handling

### Common Errors

1. **Invalid Account Number**
   - Validation: Must be 10-16 digits
   - Error message displayed inline

2. **Wrong OTP Code**
   - User can resend OTP
   - Clear error message from API

3. **WebSocket Connection Failure**
   - Auto-reconnection with exponential backoff
   - Maximum 5 reconnection attempts
   - User-friendly error messages

4. **Popup Blocked**
   - Detection and user notification
   - Instructions to enable popups

5. **Authentication Timeout**
   - 5-minute timeout with clear message
   - Option to restart process

## Loading States

- ✅ Button spinners during API calls
- ✅ Skeleton loaders on list page
- ✅ Disabled buttons during async operations
- ✅ Full-page loader during WebSocket connection
- ✅ Progress indication in stepper

## Status Badges

- **PENDING_OTP**: Yellow badge - Awaiting OTP verification
- **OTP_VERIFIED**: Green badge - OTP verified successfully
- **COMPLETED**: Outline badge - Harmonization completed

## Validation Rules

### Account Number
- Must be numeric
- Minimum 10 digits
- Maximum 16 digits

### OTP Code
- Exactly 6 digits
- Numeric only
- Required field

### Consent
- Must be checked to proceed
- Required for Fayda authentication

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Mobile Responsiveness

- Responsive grid layouts
- Touch-friendly buttons
- Mobile-optimized modals
- Adaptive stepper UI

## Testing Checklist

### Functional Testing
- [ ] Menu visible for authorized roles only
- [ ] List page loads and displays data correctly
- [ ] Create button opens modal
- [ ] Step 1: OTP sends successfully
- [ ] Step 1: OTP verifies correctly
- [ ] Step 1: Invalid OTP shows error
- [ ] Step 2: Consent checkbox required
- [ ] Step 2: WebSocket connects
- [ ] Step 2: Popup opens without blocking
- [ ] Step 2: Fayda data displays correctly
- [ ] Step 3: Data comparison shows both columns
- [ ] Step 3: Harmonization submits successfully
- [ ] Success: Modal closes and list refreshes
- [ ] Navigation: Back buttons work correctly

### Error Handling
- [ ] Invalid account number rejected
- [ ] Network errors handled gracefully
- [ ] WebSocket connection timeout handled
- [ ] Popup blocker detected and reported
- [ ] Authentication timeout handled
- [ ] API errors display toast messages

### Edge Cases
- [ ] WebSocket disconnection during auth
- [ ] User closes popup manually
- [ ] Multiple rapid button clicks prevented
- [ ] Long account numbers handled
- [ ] Special characters in data display correctly
- [ ] Image loading failures handled

## Troubleshooting

### WebSocket Connection Issues
1. Check network connectivity
2. Verify WebSocket URL is correct
3. Check for firewall/proxy blocking WSS
4. Review browser console for errors

### Popup Blocked
1. Enable popups for the domain
2. Check browser popup settings
3. Disable popup blockers temporarily

### OTP Not Received
1. Verify phone number is correct
2. Check SMS service status
3. Wait 30 seconds before resending
4. Check phone network connectivity

## Performance Considerations

- WebSocket singleton pattern prevents multiple connections
- RTK Query caching reduces API calls
- Lazy image loading for profile pictures
- Optimistic UI updates where possible
- Debounced input validation

## Future Enhancements

- [ ] QR code option for mobile verification
- [ ] Biometric authentication support
- [ ] Multi-language support
- [ ] Export harmonization history
- [ ] Bulk harmonization feature
- [ ] SMS template customization
- [ ] Real-time status updates via WebSocket

## Support

For issues or questions, contact the development team or refer to the main project documentation.

## License

Proprietary - Cooperative Bank of Oromia

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team


