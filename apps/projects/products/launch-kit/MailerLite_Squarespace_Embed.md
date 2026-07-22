# MailerLite Signup Form — Squarespace Embed
Form: "Gnosis Course — Signup" · adds subscribers to group "Gnostic Practices for Beginners"
→ which triggers the "Welcome — Module 1" automation. Double opt-in is ON (GDPR-compliant).
MailerLite account: 2511754 · Form ID: h2YxFE

## STEP 1 — Universal snippet (add ONCE, site-wide)
Squarespace → Settings → Advanced → Code Injection → HEADER box → paste this → Save:

<!-- MailerLite Universal -->
<script>
(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
.push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
ml('account', '2511754');
</script>
<!-- End MailerLite Universal -->

## STEP 2 — Form embed (on the page where you want the form)
Add a Squarespace "Code" block wherever the form should appear → paste:

<div class="ml-embedded" data-form="h2YxFE"></div>

## ZERO-CODE ALTERNATIVE (no code injection needed)
Hosted signup page — link a button to it from anywhere on your site:
Share URL: https://preview.mailerlite.io/forms/2511754/  (full URL on the form's Overview page → "Share url" → Copy)

## HOW THE FUNNEL WORKS
1. Visitor enters email in the form
2. MailerLite sends a confirmation email (double opt-in)
3. They click confirm → added to "Gnostic Practices for Beginners" group
4. Joining the group triggers the "Welcome — Module 1" automation → welcome email with the Module 1 download button
