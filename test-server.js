async function test() {
  const loginRes = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aliuanas004@gmail.com', password: 'password123' }) // Let's try some default credentials or just see if login responds
  });
  console.log('Login Status:', loginRes.status);
  const data = await loginRes.json();
  console.log('Login Data:', data);
  if (!data || !data.data || !data.data.accessToken) return;
  
  const token = data.data.accessToken;
  const meRes = await fetch('http://localhost:8000/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Me Status:', meRes.status);
  const meData = await meRes.json();
  console.log('Me Data:', meData);
}

test();
