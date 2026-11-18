# 🔐 Environment Variables & API Keys Setup Guide

This guide provides step-by-step instructions on **where to get all API keys** and **how to configure your environment variables** for the Biotech International website.

---

## 📋 Overview of Required Variables

| Variable Name | Required For | Where It Runs | Description |
|:---|:---|:---|:---|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Contact & Enquiry Forms | Client (Browser) | EmailJS Service ID (connects to your mailbox) |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Contact & Enquiry Forms | Client (Browser) | EmailJS Template ID (formats the sent email) |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Contact & Enquiry Forms | Client (Browser) | EmailJS Account Public API Key |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Form Spam Protection | Client (Browser) | Google reCAPTCHA v2 Site Key ("I'm not a robot") |
| `RECAPTCHA_SECRET_KEY` | Backend Token Verification | Server-side | Google reCAPTCHA v2 Secret Key |

---

## 📧 Part 1: How to Set Up EmailJS (Email Delivery)

EmailJS allows the Contact and Product Enquiry forms to send emails directly to the company inbox without needing a custom backend server.

### Step 1: Create an EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and click **Sign Up Free**.
2. Log in to your dashboard.

### Step 2: Add an Email Service (Connect Company Mailbox)
1. In the left sidebar, click **Email Services**.
2. Click **Add New Service**.
3. Select your provider:
   - **Gmail** (recommended for quick setup with a company Gmail / Google Workspace)
   - **Outlook / Microsoft 365**
   - **Custom SMTP** (for private company mail servers, e.g. `mail.biotech-int.com`)
4. Connect and authorize the email account that will receive and send notifications.
5. Once created, you will see your **Service ID** (e.g. `service_gxwp9lr`).
   - ➔ Copy this as **`NEXT_PUBLIC_EMAILJS_SERVICE_ID`**.

### Step 3: Create an Email Template
1. In the left sidebar, click **Email Templates**.
2. Click **Create New Template**.
3. In the template editor, configure:
   - **To Email:** Set to the company inbox (e.g. `info@biotech-int.com` or your admin email).
   - **Subject:** `{{title}}`
   - **Body / Content:** Paste the following template so all form data maps properly:

```html
<h3>New Website Inquiry Received</h3>
<p><strong>Full Name:</strong> {{name}}</p>
<p><strong>Email Address:</strong> {{email}}</p>
<p><strong>Company:</strong> {{company}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Country:</strong> {{country}}</p>
<p><strong>Product Interest:</strong> {{product_category}}</p>
<hr />
<h4>Message:</h4>
<p>{{message}}</p>
```

4. Click **Save** in the top right.
5. In the Settings tab of that template, you will see your **Template ID** (e.g. `template_7flq5b6`).
   - ➔ Copy this as **`NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`**.

### Step 4: Get Your Account Public Key
1. In the left sidebar, click **Account** (or the gear icon).
2. Under the **API Keys** tab, you will see **Public Key** (e.g. `KYJx_rUIHX9fjFQGT`).
   - ➔ Copy this as **`NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`**.

*(Note: Under **Security**, if you have reCAPTCHA verification enabled, ensure your Google reCAPTCHA secret key is entered in EmailJS as well).*

---

## 🛡️ Part 2: How to Set Up Google reCAPTCHA v2

Google reCAPTCHA prevents automated bots and spammers from submitting forms.

### Step 1: Open Google reCAPTCHA Admin
1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin).
2. Sign in with your Google / Company account.

### Step 2: Register a New Site
Click the **+ (Create)** button in the top right and enter:

1. **Label:** `Biotech International Ltd`
2. **reCAPTCHA type:** 
   - Select **reCAPTCHA v2** *(Important: Must be v2, not v3)*
   - Select **"I'm not a robot" Checkbox**
3. **Domains:** Add all domains where the website will run:
   - `localhost` *(for local development)*
   - `127.0.0.1`
   - `bio-tech-beta.vercel.app` *(your Vercel preview domain)*
   - `bio-tech-weld.vercel.app`
   - `biotech-int.com` *(your production custom domain, when active)*
   - `www.biotech-int.com`
4. Accept the reCAPTCHA Terms of Service.
5. Click **Submit**.

### Step 3: Copy Your Keys
After submitting, Google displays two keys:
1. **Site Key** (Public): 
   - ➔ Copy as **`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`**
2. **Secret Key** (Private): 
   - ➔ Copy as **`RECAPTCHA_SECRET_KEY`**

---

## 💻 Part 3: Local Configuration (`.env.local`)

1. In the `my-next-app` directory, create or edit the file named `.env.local`:
   ```bash
   # In Windows PowerShell:
   notepad my-next-app/.env.local
   ```

2. Add your keys:
   ```env
   # EmailJS Configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here

   # Google reCAPTCHA v2 ("I'm not a robot" Checkbox)
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
   ```

3. Restart your local development server for Next.js to read the new environment file:
   ```bash
   npm run dev
   ```

---

## ☁️ Part 4: Production Deployment (Vercel)

When deploying to Vercel, `.env.local` is ignored by Git for security. You must add these keys directly in the Vercel dashboard:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project: **`bio-tech`** (or `bio-tech-beta`).
3. Click on **Settings** (top menu) ➔ **Environment Variables** (left sidebar).
4. Add each of the 5 variables:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
5. Select all environments: **Production**, **Preview**, and **Development**.
6. Click **Save**.
7. Go to **Deployments** tab and click **Redeploy** on your latest deployment so the new environment variables take effect.

---

## ✅ Testing Your Setup

1. Open the website:
   - Go to `/contact` and fill out the Contact Form.
   - Go to `/products`, click **"Request"** on any product card, and fill out the Enquiry Modal.
2. Complete the reCAPTCHA checkbox.
3. Click **Send Enquiry**.
4. Check your company email inbox — you should receive an email within 5–10 seconds containing all the client's information!
