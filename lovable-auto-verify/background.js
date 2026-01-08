// Background script for Lovable Auto Verify extension
console.log("Lovable Auto Verify background script loaded");

// Properly handle runtime errors to prevent service worker registration failures
try {
    // Listen for installation to show welcome message
    chrome.runtime.onInstalled.addListener(() => {
        console.log("Lovable Auto Verify extension installed");
        
        // Set up context menu for quick access
        chrome.contextMenus.create({
            id: "lovableAutoVerify",
            title: "Auto Verify Lovable Account",
            contexts: ["page", "selection"]
        });
    });

    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "verificationStatusChanged") {
            console.log("Account verification status changed:", request.status);
            // You can add logic here to notify the user or update extension UI
        }
        
        // Handle email monitoring request
        if (request.action === "startEmailMonitoring") {
            startEmailMonitoring(request.email);
            sendResponse({status: "started"});
        }
        
        return true; // Keep message channel open for async response
    });

    // Handle context menu click
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "lovableAutoVerify") {
            // Send message to content script to start verification process
            chrome.tabs.sendMessage(tab.id, {
                action: "startVerificationProcess"
            });
        }
    });
} catch (error) {
    console.error("Error in background script:", error);
}

// Function to monitor email for verification links
async function startEmailMonitoring(email) {
    console.log("Starting email monitoring for:", email);
    
    // This is a simplified approach - in a real extension you would need to:
    // 1. Access email through an API or by monitoring email tabs
    // 2. Look for emails from Lovable with verification links
    // 3. Extract and click the verification link
    
    // For this example, we'll set up a periodic check
    const interval = setInterval(async () => {
        const verificationLink = await findVerificationLinkInEmails(email);
        if (verificationLink) {
            clearInterval(interval);
            await openVerificationLink(verificationLink);
        }
    }, 5000); // Check every 5 seconds
    
    // Stop monitoring after 10 minutes
    setTimeout(() => {
        clearInterval(interval);
        console.log("Stopped email monitoring - timeout reached");
    }, 600000); // 10 minutes
}

// Function to find verification link in emails (simplified)
async function findVerificationLinkInEmails(email) {
    // This function would normally interface with email APIs or scan email tabs
    // For this example, we'll just return a mock verification link
    // In a real implementation, you would scan the email content
    
    // Get all tabs and look for email service tabs
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        if (isEmailService(tab.url)) {
            // Execute script in email tab to look for verification link
            try {
                const result = await chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: searchForVerificationLink
                });
                
                if (result && result[0]?.result?.link) {
                    return result[0].result.link;
                }
            } catch (error) {
                console.error("Error searching for verification link:", error);
            }
        }
    }
    
    return null;
}

// Function to check if URL is an email service
function isEmailService(url) {
    return url.includes('gmail.com') || 
           url.includes('outlook.com') || 
           url.includes('yahoo.com') ||
           url.includes('mail.google.com') ||
           url.includes('outlook.live.com') ||
           url.includes('mail.yahoo.com');
}

// Function to open verification link
async function openVerificationLink(link) {
    console.log("Found verification link:", link);
    
    // Create a new tab with the verification link
    await chrome.tabs.create({
        url: link,
        active: false // Don't make it the active tab
    });
    
    console.log("Verification link opened in new tab");
    
    // Optionally, you could also send a message to update the popup UI
    chrome.runtime.sendMessage({
        action: "verificationLinkFound",
        link: link
    });
}

// Function to be injected into email tabs to search for verification links
function searchForVerificationLink() {
    // Look for common verification link patterns in email content
    const verificationSelectors = [
        'a[href*="verify"]',
        'a[href*="confirm"]', 
        'a[href*="activate"]',
        'a[href*="verification"]',
        'a[href*="email/confirm"]',
        'a[href*="email-verify"]'
    ];
    
    for (const selector of verificationSelectors) {
        const links = document.querySelectorAll(selector);
        for (const link of links) {
            // Check if the link is from Lovable
            if (link.href.includes('lovable.co') || link.textContent.toLowerCase().includes('verify') || 
                link.textContent.toLowerCase().includes('confirm') || link.textContent.toLowerCase().includes('activate')) {
                return { link: link.href };
            }
        }
    }
    
    // If no verification links found, return null
    return { link: null };
}