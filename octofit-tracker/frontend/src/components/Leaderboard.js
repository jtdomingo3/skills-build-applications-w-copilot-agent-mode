import React, { useEffect, useState } from 'react';

function baseUrl() {
  const cs = process.env.REACT_APP_CODESPACE_NAME;
  if (cs) return `https://${cs}-8000.app.github.dev`;
  return 'http://localhost:8000';
}

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `${baseUrl()}/api/leaderboard/`;
    console.log('Fetching Leaderboard from', url);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('Leaderboard response', json);
        const items = json.results ?? json;
        setData(items);
      })
      .catch(err => console.error('Leaderboard fetch error', err));
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {data.map((e, i) => (
          <li key={i}>{e.score} — {e.user?.name ?? e.user}</li>
        ))}
      </ol>
    </div>
  );
}
