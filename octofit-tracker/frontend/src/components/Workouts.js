import React, { useEffect, useState } from 'react';

function baseUrl() {
  const cs = process.env.REACT_APP_CODESPACE_NAME;
  if (cs) return `https://${cs}-8000.app.github.dev`;
  return 'http://localhost:8000';
}

export default function Workouts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `${baseUrl()}/api/workouts/`;
    console.log('Fetching Workouts from', url);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('Workouts response', json);
        const items = json.results ?? json;
        setData(items);
      })
      .catch(err => console.error('Workouts fetch error', err));
  }, []);

  return (
    <div>
      <h2>Workouts</h2>
      <ul>
        {data.map((w, i) => (
          <li key={i}>{w.name} — {w.difficulty}</li>
        ))}
      </ul>
    </div>
  );
}
