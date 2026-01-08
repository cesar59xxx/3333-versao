document.addEventListener('DOMContentLoaded', function() {
    const createAccountBtn = document.getElementById('createAccountBtn');
    const statusDiv = document.getElementById('status');
    
    createAccountBtn.addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        
        // Validate inputs
        if (!email || !password || !firstName || !lastName) {
            showStatus('Please fill in all fields', 'error');
            return;
        }
        
        // Save account info to storage
        await chrome.storage.sync.set({
            accountInfo: {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            }
        });
        
        // Create account
        try {
            await createAccount(email, password, firstName, lastName);
            showStatus('Account created! Waiting for verification email...', 'success');
            
            // Start monitoring emails for verification link
            await monitorVerificationEmail(email);
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
        }
    });
    
    async function createAccount(email, password, firstName, lastName) {
        // Get the active tab and inject script to create account
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        // Execute script to fill and submit registration form
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: fillRegistrationForm,
            args: [email, password, firstName, lastName]
        });
        
        // Wait a bit for the page to process
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    async function monitorVerificationEmail(email) {
        // This function would typically connect to an email service API
        // For demonstration, we'll simulate checking for verification
        showStatus('Monitoring emails for verification link...', 'success');
        
        // Simulate finding and clicking verification link after some time
        setTimeout(async () => {
            try {
                await clickVerificationLink();
                showStatus('Account verified successfully!', 'success');
            } catch (error) {
                showStatus(`Verification failed: ${error.message}`, 'error');
            }
        }, 10000); // Wait 10 seconds to simulate email delay
    }
    
    async function clickVerificationLink() {
        // Get the active tab and look for verification link
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        // Switch to email tab and find verification link
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: findAndClickVerificationLink
        });
    }
});

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
}

// Functions to be injected into the webpage
function fillRegistrationForm(email, password, firstName, lastName) {
    // Find and fill registration form fields
    const emailField = document.querySelector('input[type="email"], input[name="email"], input[id*="email"]');
    const passwordField = document.querySelector('input[type="password"], input[name="password"], input[id*="password"]');
    const firstNameField = document.querySelector('input[name*="first"], input[id*="first"], input[name*="fname"], input[id*="fname"]');
    const lastNameField = document.querySelector('input[name*="last"], input[id*="last"], input[name*="lname"], input[id*="lname"]');
    const submitButton = document.querySelector('button[type="submit"], input[type="submit"], .register-btn, .signup-btn');
    
    if (emailField) emailField.value = email;
    if (passwordField) passwordField.value = password;
    if (firstNameField) firstNameField.value = firstName;
    if (lastNameField) lastNameField.value = lastName;
    
    // Trigger input events to ensure React/Angular forms recognize the changes
    if (emailField) emailField.dispatchEvent(new Event('input', {bubbles: true}));
    if (passwordField) passwordField.dispatchEvent(new Event('input', {bubbles: true}));
    if (firstNameField) firstNameField.dispatchEvent(new Event('input', {bubbles: true}));
    if (lastNameField) lastNameField.dispatchEvent(new Event('input', {bubbles: true}));
    
    // Submit the form
    if (submitButton) {
        submitButton.click();
    } else {
        // If no submit button found, try submitting the form directly
        const form = emailField?.closest('form') || passwordField?.closest('form');
        if (form) {
            form.submit();
        }
    }
}

function findAndClickVerificationLink() {
    // Look for verification links in email page
    const verificationLinks = Array.from(document.querySelectorAll('a[href*="verify"], a[href*="confirm"], a[href*="activate"]'));
    
    // Filter for likely verification links
    const likelyVerificationLinks = verificationLinks.filter(link => 
        link.href.includes('verification') || 
        link.href.includes('confirm') || 
        link.href.includes('activate') ||
        link.textContent.toLowerCase().includes('verify') ||
        link.textContent.toLowerCase().includes('confirm') ||
        link.textContent.toLowerCase().includes('activate')
    );
    
    if (likelyVerificationLinks.length > 0) {
        // Click the first likely verification link
        likelyVerificationLinks[0].click();
        return true;
    }
    
    // If no verification links found, throw error
    throw new Error('No verification link found in email');
}