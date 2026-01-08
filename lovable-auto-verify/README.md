# Lovable Auto Verify Extension

A Chrome extension that automatically creates accounts and verifies identity through email links on Lovable.

## Features

- Automatically fills and submits registration forms on Lovable
- Monitors email for verification links
- Automatically clicks verification links to complete account setup
- Simple popup interface for entering account details

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `lovable-auto-verify` folder
4. The extension icon should now appear in your toolbar

## Usage

1. Navigate to the Lovable registration page
2. Click the extension icon in your toolbar
3. Fill in your desired account information:
   - Email address
   - Password
   - First name
   - Last name
4. Click "Create Account & Verify"
5. The extension will:
   - Fill out the registration form automatically
   - Submit the form
   - Monitor your email for verification links
   - Automatically click the verification link when received

## Important Notes

⚠️ **Legal and Ethical Considerations:**
- This extension is intended for legitimate use on accounts you own
- Respect Lovable's Terms of Service
- Do not use for creating fake or duplicate accounts in violation of their policies
- Be aware that websites may detect and block automated account creation

🔧 **Technical Details:**
- The extension requires access to Lovable's domain and email services
- It uses content scripts to interact with web pages
- Email monitoring works with Gmail, Outlook, and Yahoo Mail

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - User interface for the extension popup
- `popup.js` - Logic for the popup interface
- `content.js` - Scripts that run on Lovable website
- `background.js` - Background processes and email monitoring
- `icons/` - Extension icons

## Limitations

- Requires the email tab to be open for verification link detection
- May not work if Lovable changes their form structure
- Email monitoring is limited to popular email providers
- Some security measures might prevent automation

## Troubleshooting

- Make sure you've granted all necessary permissions
- Ensure your email tab is accessible to the extension
- Check that the registration form elements match expected selectors
- Verify that you're on the correct Lovable domain