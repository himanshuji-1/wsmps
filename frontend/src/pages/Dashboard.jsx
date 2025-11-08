import React, { useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [record, setRecord] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  async function submitSymptoms(symptomsText, age) {
    const symptoms = symptomsText.split(",").map((s) => s.trim()).filter(Boolean);
    const res = await API.post("/symptoms", {
      symptoms,
      severity: "moderate",
      duration: "2 days",
      age,
      allergies: [],
      currentMedications: [],
    });
    console.log("Saved symptom record:", res.data);
    setRecord(res.data);
  }

  async function fetchSuggestions() {
    if (!record?._id) return alert("No symptom record found yet!");
    const res = await API.post("/suggestions", {
      symptomRecordId: record._id,
      useLLM: true, // or true if you have your API key set
    });
    setSuggestions(res.data.suggestions || []);
  }

  const [symText, setSymText] = useState("fever, body ache");
  const [age, setAge] = useState(25);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Submit Symptoms</h3>
        <textarea
          className="border p-2 w-full mb-2"
          value={symText}
          onChange={(e) => setSymText(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 w-full mb-2"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => submitSymptoms(symText, age)}
        >
          Submit
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Suggestions</h3>
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded mb-2"
          onClick={fetchSuggestions}
        >
          Get Suggestions
        </button>
        <ul>
          {suggestions.map((s, i) => (
            <li key={i} className="border-b py-2">
              {s.name} — {s.score} {s.blocked ? "⚠️" : "✅"}
              <div className="text-sm text-gray-600">{s.reasons?.join("; ")}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
