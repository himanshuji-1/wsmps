import React, { useState } from 'react';
import API from '../api/api';
export default function SymptomForm(){
  const [symptoms,setSymptoms]=useState('fever, cough'); const [age,setAge]=useState(25);
  async function submit(e){ e.preventDefault();
    const arr = symptoms.split(',').map(s=>s.trim()).filter(Boolean);
    try{ const res = await API.post('/symptoms',{ symptoms: arr, severity:'moderate', duration:'2 days', age, allergies:[], currentMedications:[] }); alert('Saved'); console.log(res.data); }
    catch(e){ alert('Failed'); }
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Submit Symptoms</h3>
      <textarea className="border p-2 w-full mb-2" value={symptoms} onChange={e=>setSymptoms(e.target.value)} />
      <input type="number" className="border p-2 w-full mb-2" value={age} onChange={e=>setAge(e.target.value)} />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
    </form>
  );
}
