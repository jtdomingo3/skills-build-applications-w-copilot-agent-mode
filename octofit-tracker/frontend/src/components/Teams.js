import React, { useEffect, useState } from 'react';

function baseUrl() {
  const cs = process.env.REACT_APP_CODESPACE_NAME;
  if (cs) return `https://${cs}-8000.app.github.dev`;
  return 'http://localhost:8000';
}

export default function Teams() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `${baseUrl()}/api/teams/`;
    console.log('Fetching Teams from', url);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('Teams response', json);
        const items = json.results ?? json;
        setData(items);
      })
      .catch(err => console.error('Teams fetch error', err));
  }, []);

  return (
    <div>
      <h2>Teams</h2>
      <ul>
        {data.map((t, i) => (
          <li key={i}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
