import React, { useState } from 'react';
import API from '../api/api';
export default function Suggestions(){
  const [symId,setSymId]=useState(''); const [list,setList]=useState([]);
  async function fetchSuggestions(){ try{ const res = await API.post('/suggestions',{ symptomRecordId: symId, useLLM: false }); setList(res.data.suggestions || []); }catch(e){ alert('Failed'); } }
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Get Suggestions</h3>
      <input className="border p-2 w-full mb-2" placeholder="Symptom Record ID" value={symId} onChange={e=>setSymId(e.target.value)} />
      <button className="bg-indigo-600 text-white px-3 py-1 rounded mb-2" onClick={fetchSuggestions}>Get</button>
      <ul>
        {list.map((s,i)=>(<li key={i} className="border-b py-2">{s.name} — {s.score} {s.blocked? '⚠️':'✅'} <div className="text-sm text-gray-600">{s.reasons?.join('; ')}</div></li>))}
      </ul>
    </div>
  );
}
