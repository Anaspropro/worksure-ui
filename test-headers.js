async function test() {
  const loginRes = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@worksure.com', password: 'password123' }) // Need a valid user
  });
  
  if (!loginRes.ok) {
    console.log("Login failed");
    return;
  }
  
  const data = await loginRes.json();
  const token = data.data.accessToken;
  
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("accept", "application/json");
  headers.set("origin", "http://10.44.227.59:3000");
  headers.set("referer", "http://10.44.227.59:3000/admin");
  headers.set("user-agent", "Mozilla/5.0");

  const meRes = await fetch('http://localhost:8000/auth/me', { headers });
  console.log('Me Status with headers:', meRes.status);
}
test();
