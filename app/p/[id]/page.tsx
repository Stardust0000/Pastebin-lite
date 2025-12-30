import { headers } from "next/headers";

export default async function PastePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const h = await headers();
  const host = h.get("host");

  const res = await fetch(
  `http://${host}/api/pastes/${id}`,
  { cache: "no-store" }
  );


  if (!res.ok) {
    return (
      <div style={{ padding: "40px", fontFamily: "monospace" }}>
        <h1>Paste not found or expired</h1>
      </div>
    );
  }

  const data = await res.json();



  return (
    <div
  style={{
    maxWidth: "900px",
    margin: "80px auto",
    padding: "24px",
    background: "#0f172a",
    color: "#e5e7eb",
    borderRadius: "8px",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }}
>
  <h1 style={{ marginBottom: "16px" }}>Pastebin Lite</h1>
  <pre style={{ lineHeight: "1.6" }}>{data.content}</pre>
</div>

  );
}
