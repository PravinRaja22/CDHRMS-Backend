import { ConfidentialClientApplication, CryptoProvider } from '@azure/msal-node';

const config = {
  auth: {
    clientId: 'ea82ec5f-8eed-4bcd-a8a9-a23281ed90df',
    authority: 'https://login.microsoftonline.com/f54320b2-b052-4d15-b50b-e7003517a7c5',
    clientSecret: 'ofz8Q~Iy.GWJVjfkePRsl-U7y.3ixqPqs9Mu6bt4',
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
        scopes: ['user.read'],
      });
  
      // Token is valid, and you can use the information in 'authResult' to extract user details or perform other actions.
      console.log('Token validation success:', authResult);
      return true;
    } catch (error) {
      console.error('Token validation error:', error.message);
      return false;
    }
  }
  // Example usage
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyJ9.eyJhdWQiOiJlYTgyZWM1Zi04ZWVkLTRiY2QtYThhOS1hMjMyODFlZDkwZGYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZjU0MzIwYjItYjA1Mi00ZDE1LWI1MGItZTcwMDM1MTdhN2M1L3YyLjAiLCJpYXQiOjE3MDY3ODk2MTMsIm5iZiI6MTcwNjc4OTYxMywiZXhwIjoxNzA2NzkzNTEzLCJhaW8iOiJBV1FBbS84VkFBQUE5L3FTM20rOGxPNG5kU1EzMlhIcDgrSzZBdWk2M1pRbkNZanRxdjZ4RlJ6TnFVdUF0ejlTbHBsa2NqT0M2TDRlbm4rcUVId21kYm54S0dkV1pkNTFsRjYwN0I0MlBpQ0MyaWV2bDRBOTN1YVM4L1REbjR4UVE0dVhrc1pnOGJSbyIsIm5hbWUiOiJTYWNoaXRoYW5hbmRoYW0gS3VtYXJhZ3VydWJhcmFuIiwibm9uY2UiOiIxMDVlN2RhNS1mN2Y4LTQxYTctODg3Zi02ZDBkNThmMmQwNTgiLCJvaWQiOiI2MjgxYjZjYi0xYjM3LTQ3ZWEtOWRkOS03NDRiNWMwNmM2N2MiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzYWNoaS5rQGNsb3VkZGVzay5hZSIsInJoIjoiMC5BVlVBc2lCRDlWS3dGVTIxQy1jQU5SZW54Vl9zZ3VydGpzMUxxS21pTW9IdGtOLUlBRUEuIiwic3ViIjoiZ2lXNHdCbjNia1ljYTdEbWkyc21GUm9aRnBzZTVuaWhqQkFnWkVOeVNmZyIsInRpZCI6ImY1NDMyMGIyLWIwNTItNGQxNS1iNTBiLWU3MDAzNTE3YTdjNSIsInV0aSI6Il92X1F1Zm1Jcmt5ZnRFYkplTTNrQUEiLCJ2ZXIiOiIyLjAifQ.Xzl2kXhBY8069QIXCtRPljpyspRg8iqSYpzqb8pasp5nwL_NxE7DLN36ENNipVaEhIpzycyq5u8qvKZC4HQAyJ4CdBT9rzUMRWseSvUvD2agDW0UuJmhYvEtRUBRUJTtJRx6hsopik3A70P_ZF8dIkz9XPK-UpHSGaONt0qQ0Ugk3asfYNOJJ4OsRJQw4CLYLfD0ff-uBSVDbtTAysOaNduIgULq4n2Olov1zuOzyMRga4DUZfaU8hLFqxGotNwSdK1wxxIFkElRzUHvPgofvsN-HYvmca1oD9tbxzM_RFTlTNj4c8Iu7GeC_QdMSqKszna9DBH6ZpvDLF7rTGcP8g';
//   validateToken(token);