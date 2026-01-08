// Content script for Lovable website
console.log("Lovable Auto Verify content script loaded");

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillRegistrationForm") {
        fillRegistrationForm(request.data);
        sendResponse({status: "success"});
    } else if (request.action === "checkVerificationStatus") {
        const isVerified = checkVerificationStatus();
        sendResponse({verified: isVerified});
    }
});

function fillRegistrationForm(data) {
    // Fill registration form with provided data
    const emailField = document.querySelector('input[type="email"], input[name="email"], input[id*="email"], #email');
    const passwordField = document.querySelector('input[type="password"], input[name="password"], input[id*="password"], #password');
    const firstNameField = document.querySelector('input[name*="first"], input[id*="first"], input[name*="fname"], input[id*="fname"], #firstName, #firstname');
    const lastNameField = document.querySelector('input[name*="last"], input[id*="last"], input[name*="lname"], input[id*="lname"], #lastName, #lastname');
    
    if (emailField) {
        emailField.value = data.email;
        emailField.dispatchEvent(new Event('input', {bubbles: true}));
        emailField.dispatchEvent(new Event('change', {bubbles: true}));
    }
    
    if (passwordField) {
        passwordField.value = data.password;
        passwordField.dispatchEvent(new Event('input', {bubbles: true}));
        passwordField.dispatchEvent(new Event('change', {bubbles: true}));
    }
    
    if (firstNameField) {
        firstNameField.value = data.firstName;
        firstNameField.dispatchEvent(new Event('input', {bubbles: true}));
        firstNameField.dispatchEvent(new Event('change', {bubbles: true}));
    }
    
    if (lastNameField) {
        lastNameField.value = data.lastName;
        lastNameField.dispatchEvent(new Event('input', {bubbles: true}));
        lastNameField.dispatchEvent(new Event('change', {bubbles: true}));
    }
    
    // Look for and click the submit button
    const submitButtons = [
        document.querySelector('button[type="submit"]'),
        document.querySelector('input[type="submit"]'),
        document.querySelector('.register-btn'),
        document.querySelector('.signup-btn'),
        document.querySelector('#submit'),
        document.querySelector('button[type="button"][onclick*="register" i]'),
        document.querySelector('button[type="button"][onclick*="sign" i]')
    ].filter(btn => btn !== null);
    
    if (submitButtons.length > 0) {
        submitButtons[0].click();
    } else {
        // If no explicit submit button, try to submit the form
        const form = document.querySelector('form');
        if (form) {
            form.submit();
        }
    }
}

function checkVerificationStatus() {
    // Check if the account is verified by looking for specific elements
    const verificationElements = [
        document.querySelector('.verified-badge'),
        document.querySelector('.account-verified'),
        document.querySelector('[data-verified="true"]'),
        document.querySelector('#verification-success')
    ];
    
    return verificationElements.some(el => el !== null);
}

// Monitor DOM changes to detect verification state changes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // Check if verification-related elements have appeared
        if (mutation.type === 'childList') {
            const verificationElements = mutation.addedNodes;
            for (let i = 0; i < verificationElements.length; i++) {
                const element = verificationElements[i];
                if (element.nodeType === 1) { // Element node
                    if (element.classList && 
                        (element.classList.contains('verified') || 
                         element.classList.contains('verified-badge') ||
                         element.classList.contains('account-verified'))) {
                        // Notify background script of verification status change
                        chrome.runtime.sendMessage({
                            action: "verificationStatusChanged",
                            status: true
                        });
                    }
                }
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});