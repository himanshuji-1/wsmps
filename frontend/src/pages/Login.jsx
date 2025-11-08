import React, { useState } from 'react';
import API from '../api/api';
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  async function submit(e){ e.preventDefault();
    try{ const res = await API.post('/auth/login',{ email, password }); localStorage.setItem('token', res.data.token); alert('Logged in'); window.location.href='/dashboard'; }
    catch(e){ alert('Login failed'); }
  }
  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <input className="border p-2 w-full mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}
