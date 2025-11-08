import React, { useState } from 'react';
import API from '../api/api';
export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  async function submit(e){ e.preventDefault();
    try{ await API.post('/auth/register',{ name,email,password,role:'patient' }); alert('Registered'); window.location.href='/login'; }
    catch(e){ alert('Register failed'); }
  }
  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      <input className="border p-2 w-full mb-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border p-2 w-full mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}
