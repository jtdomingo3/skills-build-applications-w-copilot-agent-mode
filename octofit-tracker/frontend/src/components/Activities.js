import React, { useEffect, useState } from 'react';

function baseUrl() {
  const cs = process.env.REACT_APP_CODESPACE_NAME;
  if (cs) return `https://${cs}-8000.app.github.dev`;
  return 'http://localhost:8000';
}

export default function Activities() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `${baseUrl()}/api/activities/`;
    console.log('Fetching Activities from', url);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('Activities response', json);
        const items = json.results ?? json;
        setData(items);
      })
      .catch(err => console.error('Activities fetch error', err));
  }, []);

  return (
    <div>
      <h2>Activities</h2>
      <ul>
        {data.map((a, i) => (
          <li key={i}>{a.type} — {a.duration} min — {a.date}</li>
        ))}
      </ul>
    </div>
  );
}
