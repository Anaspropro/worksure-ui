async function test() {
  const loginRes = await fetch('http://localhost:3000/api/proxy/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@worksure.com', password: 'password' })
  });
  console.log('Login Status:', loginRes.status);
  
  const cookies = loginRes.headers.get('set-cookie');
  console.log('Cookies:', cookies);
  
  if (!cookies) return;
  
  const tokenCookie = cookies.split(',').find(c => c.trim().startsWith('token='));
  if (!tokenCookie) {
    console.log("No token cookie found");
    return;
  }
  
  const meRes = await fetch('http://localhost:3000/api/proxy/auth/me', {
    headers: { 'Cookie': tokenCookie.split(';')[0].trim() }
  });
  
  console.log('Me Status:', meRes.status);
}

test();
