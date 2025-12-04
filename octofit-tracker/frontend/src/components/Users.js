import React, { useEffect, useState } from 'react';

function baseUrl() {
  const cs = process.env.REACT_APP_CODESPACE_NAME;
  if (cs) return `https://${cs}-8000.app.github.dev`;
  return 'http://localhost:8000';
}

export default function Users() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `${baseUrl()}/api/users/`;
    console.log('Fetching Users from', url);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('Users response', json);
        const items = json.results ?? json;
        setData(items);
      })
      .catch(err => console.error('Users fetch error', err));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {data.map((u, i) => (
          <li key={i}>{u.name} — {u.email} — {u.team?.name ?? u.team}</li>
        ))}
      </ul>
    </div>
  );
}
