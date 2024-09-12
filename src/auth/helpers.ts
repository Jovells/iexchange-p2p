export function extractCsrfToken(req: Request) {
    let nonce
    try {
  
      const cookieHeader = req.headers.get('cookie');
      console.log("cookieHeader", cookieHeader);
  
      if (cookieHeader) {
        // Split the cookie header into individual cookies
        const cookies = cookieHeader.split('; ');
  
        // Find and extract the authjs.csrf-token cookie
        const csrfTokenCookie = cookies.find(cookie => cookie.startsWith('authjs.csrf-token='));
        if (csrfTokenCookie) {
          const csrfToken = csrfTokenCookie.split('=')[1];
          console.log("CSRF Token:", csrfToken);
           nonce = csrfToken.split("%")[0];
        } else {
          console.log("CSRF Token not found");
        }
      } else {
        console.log("No cookies found in the request headers");
      }
    } catch (error) {
      console.error("Error processing request headers:", error);
    }
    return nonce;
  }