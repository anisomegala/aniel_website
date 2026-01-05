// src/lib/datocms.js
export async function request({ query, variables = {} }) {
  const endpoint = "https://graphql.datocms.com/";
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DATOCMS_READ_ONLY_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("DatoCMS Error:", json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data;
}