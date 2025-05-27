# BEGE Backend API (Milestone 1)

This backend API powers the authentication flow of the RideHailing mobile platform. It includes phone number verification, role-based registration, and login via email, phone, Google, and Facebook. All endpoints are documented and testable via Swagger UI and Postman.

---

##  Key Features (Milestone 1)

-  Phone number verification (OTP via Twilio)
-  Secure user registration (phone + email + password)
-  Role support: `admin`, `driver`, `passenger`
-  Login via phone or email + password
-  Google and Facebook social login
-  JWT-based authentication (access & refresh tokens)
-  Session tracking for mobile/web
-  Support for both token-based (mobile) and cookie-based (web) sessions
-  Fully documented with Swagger UI

---

##  How to Start

1. **Clone the project and install dependencies:**
    ```bash
    git clone https://github.com/BeGeltd/begeapp-backend.git
    cd begeapp-backend
    npm install
    ```
2. **Create a `.env` file from the provided `.env.example`.**

3. **Run the development server:**
    ```bash
    npm run dev
    ```

---

##  Authentication Flow

Phone verification is required before registration:

- `POST /auth/request-phone-verification` – sends OTP
- `POST /auth/phone/verify` – verifies OTP

**Registration** – only allowed if phone is verified  
**Login** – via email or phone  
**Social login** – via Google or Facebook (see notes below)  
**JWT Token refresh** – `POST /auth/refresh`  
**Logout** – `POST /auth/logout`

---

##  Swagger API Docs

Visit the Swagger UI to interact with and test all available endpoints on your PC:

 [http://localhost:5000/docs](http://localhost:5000/docs)

---

##  Postman Collection

Use the included file:  
`BeGeAPI.postman_collection.json`

Import into Postman to test all endpoints with examples pre-filled.

---

##  Google Sign-In Notes

The backend expects a Google `idToken` from the frontend.  
This token is generated using the Google Sign-In SDK (React Native, Flutter, etc.).

###  How to Get an idToken for Testing

1. Use the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. Click the ⚙️ icon → check “Use your own OAuth credentials”.
3. Enter your Google Web Client ID.
4. Select scopes:
    ```
    https://www.googleapis.com/auth/userinfo.email
    https://www.googleapis.com/auth/userinfo.profile
    ```
5. Authorize and exchange code.
6. Copy the `id_token` from the response.

**Use it in Postman:**
```json
POST /auth/google
{
  "idToken": "your_id_token_here",
  "role": "PASSENGER",
  "useCookies": false
}
```

---

##  Facebook Login Notes

The backend expects a Facebook `accessToken` from the frontend.  
This token is generated using the Facebook Login SDK (React Native or web).

###  How to Get an accessToken for Testing

1. Use the [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/).
2. Log in and select your app.
3. Click "Get User Access Token".
4. Select scopes: `email`, `public_profile`.
5. Click "Generate Access Token".

**Use it in Postman:**
```json
POST /auth/facebook
{
  "accessToken": "your_facebook_access_token_here",
  "role": "DRIVER",
  "useCookies": false
}
```

---

##  Twilio Phone Verification (OTP)

- The current implementation uses Twilio's test number: `+15005550006`
- This simulates OTP delivery without sending actual SMS
-  Works for development and testing only

 **To send real OTPs:**
- Upgrade your Twilio account
- Purchase a real Twilio phone number
- Add verified recipient numbers

> **NOTE:** Users cannot register until they successfully verify their phone number with the OTP.

---

## 🧪 Sample Registration Payload

```json
POST /auth/register
{
  "phone": "+2348100000000",
  "email": "user@example.com",
  "fullName": "Jane Doe",
  "password": "securepass",
  "confirmPassword": "securepass",
  "role": "PASSENGER",
  "useCookies": false
}
```

---

##  Tokens

- **Access Token:** expires in 15 minutes
- **Refresh Token:** valid for 30 days
- Use `/auth/refresh` to renew access tokens without logging in again

---

##  Supporting Files

- `.env.example` – configuration template
- `README.md` – this file
- `BeGeAPI.postman_collection.json` – Postman request suite