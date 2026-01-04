export async function request({ query, variables = {}, preview = false }) {
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
    // This line will print the exact field or permission error in your terminal
    console.error("DatoCMS Detail Error:", JSON.stringify(json.errors, null, 2));
    throw new Error("Failed to fetch API");
  }

  return json.data;
}