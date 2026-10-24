KVS/NVS CPT MOCK TEST — NETLIFY FUNCTIONS + FIRESTORE

CONTENTS
- public/index.html: public test UI; calls server functions and does not contain the scoring answer key.
- netlify/functions/answer-key.mjs: server-side answer key.
- netlify/functions/submit-score.mjs: calculates score on the server and writes to Firestore via Firebase Admin SDK.
- netlify/functions/leaderboard.mjs: reads shared results from Firestore via Admin SDK.
- netlify/functions/_firebase.mjs: initializes Firebase Admin SDK from a Netlify environment variable.
- netlify.toml and package.json: deployment configuration and dependency.

SECURITY
The publish directory is `public`, so the `netlify/functions` source (including answer-key.mjs) is outside the public static directory. Netlify packages function code for execution. Never move the answer key into public/ or index.html.
This is a practice-test prototype, not a high-stakes anti-cheat exam system. Server-side scoring prevents clients from simply submitting a chosen score, but anonymous public submissions can still be spammed or repeated. Add rate limiting / identity controls before relying on rankings.

DEPLOYMENT
1. Extract this ZIP. Upload the CONTENTS of `kvs-nvs-cpt-mock-test` into the root of your GitHub repository (including `public/`, `netlify/`, `netlify.toml`, `package.json`, README and rules example). Do not upload the ZIP itself as the only file.
2. In Netlify, link the existing site to this GitHub repository and deploy the main branch. Build settings should use publish directory `public`; netlify.toml already specifies it.
3. In Google Cloud Console / Firebase project `kvsnvscptmock`, create a service account with appropriate Firestore access and download its JSON key. Store the full JSON as a Netlify environment variable named `FIREBASE_SERVICE_ACCOUNT_JSON`, with Functions runtime scope. Never commit this key to GitHub or paste it into chat.
4. Redeploy after setting the environment variable.
5. Keep Firestore client rules deny-all. The Firebase Admin SDK on the server bypasses client rules; browser users cannot directly access Firestore.
6. Delete the earlier `Demo Candidate` test document from Firestore manually.
7. Test the public test and shared leaderboard. If the Firestore query requests an index, create the index specified by the error or adjust the query.

COST
Netlify function limits and Firebase/Google Cloud billing terms can change. Check current account limits before publishing; do not assume unlimited free usage.
