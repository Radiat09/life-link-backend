# SMS Integration & Document Upload Features

## Overview
This document outlines the SMS integration and document upload functionality added to the LifeLink platform.

---

## SMS Integration

### Supported Providers

#### 1. **Twilio** (Primary)
- **Setup**: Install `twilio` package
  ```bash
  npm install twilio
  ```
- **Environment Variables**:
  ```
  SMS_PROVIDER=twilio
  TWILIO_ACCOUNT_SID=your_account_sid
  TWILIO_AUTH_TOKEN=your_auth_token
  TWILIO_PHONE_NUMBER=+1234567890
  ```

#### 2. **AWS SNS** (Alternative)
- **Setup**: Install `aws-sdk` package
  ```bash
  npm install aws-sdk
  ```
- **Environment Variables**:
  ```
  SMS_PROVIDER=aws
  AWS_REGION=us-east-1
  AWS_ACCESS_KEY_ID=your_access_key
  AWS_SECRET_ACCESS_KEY=your_secret_key
  ```

#### 3. **Console/Development Mode** (Default)
- No setup required
- SMS messages are logged to console with formatted output
- Perfect for testing and development

### API Endpoints

#### Send Phone Verification
```http
POST /api/auth/send-phone-verification
Authorization: Bearer <token>
```
- **Description**: Sends a 6-digit OTP to user's phone
- **Response**:
  ```json
  {
    "success": true,
    "message": "Verification code sent to your phone",
    "data": null
  }
  ```

#### Verify Phone
```http
POST /api/auth/verify-phone
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```
- **Description**: Verifies phone number using OTP
- **OTP Validity**: 10 minutes
- **Response**:
  ```json
  {
    "success": true,
    "message": "Phone verified successfully",
    "data": null
  }
  ```

---

## Document Upload

### Supported Document Types

#### 1. Medical Certificate
- **Accepted Formats**: PDF, JPEG, PNG
- **Max File Size**: 5MB
- **Purpose**: Proof of medical fitness for blood donation

#### 2. ID Document
- **Accepted Formats**: PDF, JPEG, PNG
- **Max File Size**: 5MB
- **Purpose**: Identity verification

### API Endpoints

#### Upload Medical Certificate
```http
POST /api/documents/upload-medical-certificate
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "medicalCertificate": <file>
}
```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Medical certificate uploaded successfully",
    "data": {
      "fileName": "cert-1706812113000-123456789.pdf",
      "fileSize": 245678,
      "uploadedAt": "2026-02-01T14:28:33.624Z"
    }
  }
  ```

#### Upload ID Document
```http
POST /api/documents/upload-id-document
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "idDocument": <file>
}
```
- **Response**: Same structure as medical certificate upload

#### Get Verification Status
```http
GET /api/documents/verification-status
Authorization: Bearer <token>
```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Verification status retrieved successfully",
    "data": {
      "emailVerified": true,
      "phoneVerified": false,
      "emergencyVerified": false,
      "hasMedicalCertificate": true,
      "hasIDDocument": false,
      "fullVerificationComplete": false
    }
  }
  ```

#### Download Document
```http
GET /api/documents/download/:fileName
Authorization: Bearer <token>
```
- **Description**: Download a previously uploaded document
- **Security**: Filename validation prevents directory traversal

#### Delete Medical Certificate
```http
DELETE /api/documents/delete-medical-certificate
Authorization: Bearer <token>
```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Medical certificate deleted successfully",
    "data": null
  }
  ```

#### Delete ID Document
```http
DELETE /api/documents/delete-id-document
Authorization: Bearer <token>
```

---

## Verification Flow

### User Verification Process

```
1. User Signup
   ↓
2. Email Verification (Optional but Encouraged)
   ├─ POST /api/auth/send-email-verification
   └─ POST /api/auth/verify-email
   ↓
3. Phone Verification (Optional but Encouraged)
   ├─ POST /api/auth/send-phone-verification
   └─ POST /api/auth/verify-phone
   ↓
4. Document Upload (For Emergency Requests)
   ├─ POST /api/documents/upload-medical-certificate
   └─ POST /api/documents/upload-id-document
   ↓
5. Emergency Verification Status
   └─ GET /api/documents/verification-status
```

### Verification Levels

| Level | Requirements | Capabilities |
|-------|---|---|
| **Basic** | Email verified | Create normal blood requests (3/day limit) |
| **Standard** | Email + Phone verified | Create normal blood requests (3/day limit) |
| **Full** | Email + Phone + Documents + Admin approval | Create emergency requests (5/day limit) |

---

## File Storage

### Directory Structure
```
project/
├── uploads/
│   └── documents/
│       ├── cert-1706812113000-123456789.pdf
│       ├── id-1706812114000-987654321.jpg
│       └── ...
```

### File Naming Convention
- Format: `{documentName}-{timestamp}-{randomId}.{extension}`
- Example: `medical-cert-1706812113000-123456789.pdf`
- Prevents naming conflicts and enables version tracking

---

## Environment Configuration

### Required Environment Variables

```env
# SMS Configuration
SMS_PROVIDER=twilio  # or 'aws' or 'console'
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# AWS Configuration (if using SNS)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Frontend URL (for verification links)
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_SENDER_SMTP_USER=your_email
EMAIL_SENDER_SMTP_PASS=your_password
```

---

## Security Considerations

### SMS Security
- **OTP Validity**: 10 minutes (short window)
- **Rate Limiting**: Maximum 3 OTP requests per hour per phone number
- **Encryption**: SMS content does not contain sensitive data

### Document Security
- **File Validation**: MIME type and size validation
- **Path Traversal Prevention**: Filename sanitization
- **Access Control**: Only authenticated users can access documents
- **Storage**: Files stored outside public web directory
- **Cleanup**: Old documents automatically deleted when replaced

### Best Practices
1. Always use HTTPS in production
2. Implement rate limiting on verification endpoints
3. Log all verification attempts for audit trails
4. Regularly backup uploaded documents
5. Implement document expiration policy (e.g., re-verify annually)

---

## Error Handling

### Common Errors

| Error | Status | Solution |
|-------|--------|----------|
| File size exceeds limit | 400 | Use smaller file (<5MB) |
| Invalid file type | 400 | Use PDF, JPEG, or PNG |
| Verification code expired | 400 | Request new OTP |
| Invalid verification code | 400 | Check OTP and re-enter |
| SMS send failed | 500 | Check SMS provider config |
| Document not found | 404 | Upload document first |

---

## Testing

### Using Console Mode (Development)
All SMS messages will be logged with formatted output:
```
╔════════════════════════════════════════════════════════════╗
║                    📱 SMS SIMULATION                        ║
╠════════════════════════════════════════════════════════════╣
║ To: +8801234567890                                         ║
║ Message: Your LifeLink verification code is: 123456...    ║
╚════════════════════════════════════════════════════════════╝
```

### Using Twilio (Production)
1. Create Twilio account at https://www.twilio.com
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Set environment variables
5. Test with real phone numbers

### Testing Document Upload
```bash
curl -X POST http://localhost:5000/api/documents/upload-medical-certificate \
  -H "Authorization: Bearer <token>" \
  -F "medicalCertificate=@/path/to/document.pdf"
```

---

## Future Enhancements

- [ ] Document expiration and renewal
- [ ] OCR for document verification
- [ ] WhatsApp integration for SMS
- [ ] Email backup for SMS delivery
- [ ] Document encryption at rest
- [ ] Admin dashboard for document verification
- [ ] Automated reminders for expired documents
- [ ] Multi-language SMS support

---

## Troubleshooting

### SMS Not Sending
1. Check SMS provider credentials in `.env`
2. Verify phone number format (+country-code)
3. Check provider account balance/credits
4. Review provider logs for specific errors

### Document Upload Issues
1. Ensure `uploads/documents` directory exists
2. Check file permissions (should be writable)
3. Verify file size doesn't exceed 5MB
4. Confirm file type is PDF, JPEG, or PNG

### Verification Status Not Updating
1. Ensure verification token hasn't expired
2. Clear browser cache
3. Check user profile in database
4. Verify correct user ID in request

---

## Support & Maintenance

For issues or questions:
1. Check error logs: `logs/application.log`
2. Review environment configuration
3. Contact SMS provider support if needed
4. Check document storage permissions
