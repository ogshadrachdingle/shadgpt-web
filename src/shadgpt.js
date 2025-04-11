import { useState } from "react";
import axios from "axios";

export default function ShadGPT() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are ShadGPT, a witty chatbot that replies in a thick Yorkshire or Derbyshire dialect, depending on context.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message;
      setMessages([...newMessages, reply]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Ey up, summat went wrong there. Try agen later, love.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">ShadGPT</h1>
      <div className="border rounded p-4 h-96 overflow-y-auto bg-gray-50">
        {messages
          .filter((m) => m.role !== "system")
          .map((m, idx) => (
            <div
              key={idx}
              className={"mb-2 " + (m.role === "user" ? "text-right" : "text-left")}
            >
              <span className="inline-block px-3 py-2 rounded bg-white shadow">
                {m.content}
              </span>
            </div>
          ))}
        {loading && (
          <div className="italic text-sm text-gray-500">Typing…</div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          type="text"
          placeholder="Ask ShadGPT owt…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
