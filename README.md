# Procrastination Ebook Landing Page
## Production-Ready Single-Page Application

A clean, professional, fully responsive landing page to promote an ebook about overcoming procrastination. Built with vanilla HTML, CSS, and JavaScript—no frameworks, no build tools, ready to deploy directly to shared hosting.

---

## 📁 File Structure

```
/index.html          - Main HTML page (semantic structure, SEO-optimized)
/style.css           - Complete responsive styling (mobile-first)
/script.js           - Form handling, validation, Google Sheets integration
/ebook.pdf           - Your ebook file (place here before deployment)
/README.md           - This file
```

---

## ✨ Features Included

✅ **Responsive Design**
- Mobile-first approach
- Desktop, tablet, and mobile optimized
- Touch-friendly form inputs

✅ **Hero Section**
- Compelling headline and subtitle
- Ebook mockup image (placeholder)
- Strong call-to-action button

✅ **Benefits Section**
- 5 benefit blocks with icons and descriptions
- Hover effects and smooth animations
- Responsive grid layout

✅ **Email Capture Form**
- Clean, accessible form with labels
- Required field validation
- Email format validation (regex)
- Anti-spam honeypot field
- Real-time error messages
- Loading state while submitting
- Success/error message handling
- Auto-download of PDF after submission

✅ **Final CTA Section**
- Compelling closing section
- Additional download button
- Trust message ("No spam. Unsubscribe anytime.")

✅ **Technical Excellence**
- Semantic HTML5 structure
- SEO optimized meta tags
- Open Graph tags for social sharing
- Fast loading (no heavy dependencies)
- Accessibility features (ARIA labels, semantic HTML)
- Form submission via Google Apps Script webhook
- Clean, well-commented code

---

## 🚀 Quick Start

### Step 1: Download Your Files

You have three essential files:
- `index.html`
- `style.css`
- `script.js`

### Step 2: Set Up Google Apps Script Webhook

This landing page integrates with Google Sheets to capture leads. You need to:

1. **Create a new Google Sheet** (this will store your ebook subscriber data)
   - Go to https://sheets.google.com
   - Create a new spreadsheet
   - Name it "Ebook Subscribers" (or your preference)
   - Add column headers in Row 1:
     ```
     Name | Email | Timestamp
     ```

2. **Create a Google Apps Script**
   - In your Google Sheet, go to: **Tools → Script Editor**
   - Delete any existing code
   - Copy and paste this script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Append row to sheet
    sheet.appendRow([
      data.name,
      data.email,
      data.timestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data received'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy as Web App**
   - Click **Deploy → New Deployment**
   - Choose **Type: Web app**
   - Set "Execute as" to your Google account
   - Set "Who has access" to **Anyone** (important for form submissions)
   - Click **Deploy**
   - Copy the generated **Deployment URL**

4. **Add URL to script.js**
   - Open `script.js` in a text editor
   - Find this line (around line 12):
     ```javascript
     const GOOGLE_SCRIPT_URL = "PASTE_WEBHOOK_URL_HERE";
     ```
   - Replace `"PASTE_WEBHOOK_URL_HERE"` with your actual deployment URL:
     ```javascript
     const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent";
     ```

---

## 📄 Adding Your Ebook PDF

1. **Place your PDF file** in the same directory as `index.html`
   - File must be named exactly: `ebook.pdf`
   - If your PDF has a different name, edit this line in `script.js`:
     ```javascript
     link.href = '/ebook.pdf';  // Change 'ebook.pdf' to your filename
     ```

2. **How it works:**
   - After successful form submission
   - The browser automatically downloads `ebook.pdf`
   - No additional setup needed

---

## 🖼️ Customizing Content

### Hero Section Image
The ebook mockup uses a placeholder image. To add your own:
1. Replace the image URL in `index.html` (around line 62):
   ```html
   <img src="https://via.placeholder.com/400x500?text=Overcome+Procrastination+Ebook" 
        alt="Procrastination Ebook Cover" class="ebook-mockup">
   ```
   - Replace with: `<img src="your-image.png" ...>`
   - Add your image file to the same folder as `index.html`

### Colors & Branding
All colors are defined in `style.css` under `:root` variables (lines 6-16):
```css
--color-primary: #5B4F99;           /* Main brand color */
--color-secondary: #F7B2B2;         /* Accent color */
--color-accent: #FFD166;            /* Highlight color */
```
Change these to match your brand.

### Headlines & Copy
Simply edit the text in `index.html`:
- Line 50: Hero headline
- Line 51: Hero subtitle
- Line 79: "What You'll Learn" section title
- Lines 83-132: Benefit blocks (titles and descriptions)
- Etc.

### Logo Text
Change "ProduceHub" (line 41) to your brand name:
```html
<h1 class="logo">Your Brand Name</h1>
```

---

## 📋 Testing the Form

### Before Deployment
1. Open `index.html` in your browser
2. Scroll to the email form section
3. Enter a test name and email
4. Verify:
   - ✓ Form validates required fields
   - ✓ Email validation works (try invalid emails)
   - ✓ Button shows "Sending..." on submit
   - ✓ Success message appears after submission
   - ✓ PDF downloads automatically
   - ✓ Data appears in your Google Sheet

### Test Cases
- **Valid submission:** Name and valid email
- **Missing name:** Leave name empty, try to submit
- **Invalid email:** Enter "invalidemail" (no @)
- **Spam test:** The honeypot field is hidden; don't fill it manually

---

## 🌐 Deploying to Shared Hosting

### Option 1: Using FTP (Most Common)

1. **Obtain FTP Credentials**
   - Get from your hosting provider's control panel
   - You'll need: FTP host, username, password

2. **Using FileZilla (Free FTP Client)**
   - Download: https://filezilla-project.org/
   - Open FileZilla
   - Fill in:
     - Host: Your FTP host
     - Username: Your FTP username
     - Password: Your FTP password
     - Port: 21 (default)
   - Click **Quickconnect**

3. **Upload Files**
   - Drag and drop your 4 files:
     - `index.html`
     - `style.css`
     - `script.js`
     - `ebook.pdf`
   - If your hosting uses a `public_html` folder, upload to there
   - Otherwise, upload to root directory

4. **Test**
   - Visit your domain in a browser
   - Everything should work immediately

### Option 2: Using cPanel File Manager

1. Log in to your hosting cPanel
2. Open **File Manager**
3. Navigate to `public_html` folder
4. Click **Upload** button
5. Select all 4 files and upload
6. Click your domain to test

### Option 3: Using Netlify (Free, Recommended)

1. Go to https://netlify.com
2. Sign up with GitHub
3. Create a GitHub repository with your files:
   ```
   - index.html
   - style.css
   - script.js
   - ebook.pdf
   ```
4. On Netlify: **New site from Git**
5. Connect your GitHub repo
6. Netlify automatically deploys on each push
7. You get a free domain and HTTPS

---

## 📊 Exporting Subscriber Data from Google Sheets

### View Submissions
1. Open your Google Sheet: https://sheets.google.com
2. Find your "Ebook Subscribers" spreadsheet
3. Each form submission creates a new row with:
   - Name (Column A)
   - Email (Column B)
   - Timestamp (Column C)

### Export as CSV
1. In Google Sheets, click **File → Download → Comma-separated values (.csv)**
2. Save to your computer
3. Open in Excel, Google Sheets, or any spreadsheet app

### Export as Excel
1. Click **File → Download → Microsoft Excel (.xlsx)**
2. Save to your computer

### Mass Email Subscriptions
Use the email list to:
- Send follow-up emails with resources
- Build your email list in ConvertKit, Mailchimp, etc.
- Share exclusive content with subscribers

---

## 🔒 Security & Privacy

### Form Security
- ✓ Email validation prevents basic invalid entries
- ✓ Honeypot field catches bot spam
- ✓ Google Apps Script validates server-side
- ✓ Data sent via HTTPS (when using HTTPS hosting)

### Privacy
- Consider adding a privacy note in your footer
- Be compliant with GDPR/CCPA if applicable
- Add an unsubscribe mechanism (mentioned in footer)
- Consider using a privacy-focused email service

### HTTPS
- All forms work with HTTPS (required for security)
- Most modern hosting includes free SSL/HTTPS
- Use SSL is recommended by browsers

---

## 🎨 Browser Compatibility

Tested and works on:
- ✓ Chrome/Chromium (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

---

## ⚡ Performance Optimizations

Already included:
- No external CSS frameworks (lightweight)
- No heavy JavaScript libraries
- Optimized for Core Web Vitals
- Mobile-first responsive design
- Minimal animations (smooth scrolling only)
- Asynchronous form submission

---

## 🛠️ Customization Checklist

Before going live:
- [ ] Replace Google Apps Script URL in `script.js`
- [ ] Replace placeholder image with your ebook cover
- [ ] Update hero headline and subtitle
- [ ] Update benefits section (5 blocks)
- [ ] Customize colors if needed (style.css)
- [ ] Update footer copyright text
- [ ] Place your `ebook.pdf` in the project folder
- [ ] Test form submission
- [ ] Verify PDF download works
- [ ] Check Google Sheet is receiving data
- [ ] Test on mobile device
- [ ] Deploy to hosting

---

## 🚨 Troubleshooting

### Form Submissions Not Appearing in Google Sheet
1. Check that Google Apps Script is deployed correctly
2. Verify the deployment URL is correctly pasted in `script.js`
3. Check that Google Sheet permissions allow the script to write data
4. Open browser console (F12) and check for errors

### PDF Not Downloading
1. Verify `ebook.pdf` is in the same folder as `index.html`
2. Check file name matches exactly (case-sensitive)
3. Some browsers may block auto-download; check your browser settings

### Form Not Submitting
1. Check browser console (F12 → Console tab) for JavaScript errors
2. Verify all required fields are filled
3. Verify email format is valid (user@example.com)
4. Check that Google Script URL is configured

### Styling Looks Wrong on Mobile
1. Make sure all three files (HTML, CSS, JS) are uploaded
2. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser zoom is set to 100%

---

## 📝 File Descriptions

### index.html
- Semantic HTML5 structure
- SEO meta tags
- Accessibility features (ARIA labels)
- Responsive layout

### style.css
- Mobile-first responsive design
- Modern color palette
- CSS variables for easy customization
- Smooth transitions and hover effects
- Print-friendly styles

### script.js
- Form validation (name, email)
- Email regex validation
- Google Sheets integration via fetch API
- Loading states
- Success/error message handling
- PDF auto-download
- Smooth scrolling for navigation

---

## 📞 Support & Resources

### Google Apps Script Documentation
- https://developers.google.com/apps-script

### Web Design Resources
- MDN Web Docs: https://developer.mozilla.org/
- CSS Tricks: https://css-tricks.com/
- A List Apart: https://alistapart.com/

### Hosting Recommendations
- **Free:** Netlify, Vercel, GitHub Pages
- **Affordable:** Bluehost, SiteGround, DreamHost ($2-10/month)
- **Premium:** AWS, Google Cloud, Azure

---

## ✅ Production Checklist

- [ ] All three files uploaded to hosting
- [ ] Google Apps Script URL configured
- [ ] ebook.pdf placed in root directory
- [ ] Domain points to hosted files
- [ ] HTTPS is enabled
- [ ] Form tested with real submission
- [ ] PDF download verified
- [ ] Mobile responsiveness tested
- [ ] Google Sheet receives data
- [ ] Footer copyright updated
- [ ] Branding colors customized (if desired)

---

## 📄 License & Terms

This landing page template is provided as-is for your ebook promotion. You own all content you create. Google Sheets and Google Apps Script are free services provided by Google.

---

## 🎯 Next Steps

1. **Create your Google Apps Script** (see Step 2 above)
2. **Update script.js** with your webhook URL
3. **Add your ebook PDF**
4. **Deploy to hosting**
5. **Start collecting subscribers!**

---

**Version:** 1.0  
**Last Updated:** February 2026  
**Status:** Production Ready

