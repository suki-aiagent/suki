# API Contracts (Suki Portfolio)

Status: v0.1 — Email-only backend with SMTP placeholders (Gmail App Password recommended). No database writes for contact as per 1-C.

Notes:
- All backend routes are prefixed with /api (Kubernetes ingress requirement)
- Backend binds internally to 0.0.0.0:8001 (supervisor handles mapping)
- Frontend must use process.env.REACT_APP_BACKEND_URL and never hardcode URLs
- Until SMTP env vars are provided, POST /api/contact returns 400 Not Configured

## Endpoints

1) GET /api/
- Desc: Health/hello
- Resp 200: { "message": "Hello World" }

2) POST /api/contact
- Desc: Sends contact message via SMTP (email-only; no DB)
- Request (JSON):
  {
    "name": "string (1..200)",
    "email": "string (valid email)",
    "message": "string (1..5000)"
  }
- Success 200:
  {
    "ok": true,
    "message": "Email sent"
  }
- Errors:
  - 400 { ok: false, error: "SMTP_NOT_CONFIGURED" } when required env vars are missing
  - 422 default FastAPI validation errors
  - 500 { ok: false, error: "SMTP_SEND_FAILED" }

## Environment Variables (backend/.env)
- GMAIL_USER: sender Gmail address
- GMAIL_APP_PASSWORD: 16-char app password (Gmail 2FA required)
- CONTACT_TO: recipient email (can match GMAIL_USER)
- SUBJECT_PREFIX: e.g., "[Suki Portfolio]"
- Optional overrides: SMTP_HOST (default smtp.gmail.com), SMTP_PORT (default 587)

## Frontend Integration
- Contact form will attempt POST to `${process.env.REACT_APP_BACKEND_URL}/api/contact`.
- If the request fails (non-200 or fetch error), the form data is saved to localStorage (key: `suki_contact_msgs`) and a toast informs the user (mock fallback).

## Future Enhancements (non-breaking)
- Add provider switch (SES/SendGrid)
- Store delivered messages in MongoDB (optional 1-B style)
- Minimal admin auth for listing messages (GET /api/contact-messages)