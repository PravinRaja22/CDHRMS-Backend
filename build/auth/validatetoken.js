import { ConfidentialClientApplication } from "@azure/msal-node";
const config = {
    auth: {
        clientId: "ea82ec5f-8eed-4bcd-a8a9-a23281ed90df",
        authority: "https://login.microsoftonline.com/f54320b2-b052-4d15-b50b-e7003517a7c5",
        clientSecret: "ofz8Q~Iy.GWJVjfkePRsl-U7y.3ixqPqs9Mu6bt4",
    },
    // system: {
    //   tokenRenewalOffsetSeconds: 4 * 60,
    // },
};
const cca = new ConfidentialClientApplication(config);
export async function validateToken(token) {
    try {
        // Acquire a token using the provided token
        const authResult = await cca.acquireTokenOnBehalfOf({
            oboAssertion: token,
            scopes: ["user.read"],
        });
        // Token is valid, and you can use the information in 'authResult' to extract user details or perform other actions.
        console.log("Token validation success:");
        return { status: true, result: authResult };
    }
    catch (error) {
        console.error("Token validation error:", error.message);
        return false;
    }
}
//# sourceMappingURL=validatetoken.js.map