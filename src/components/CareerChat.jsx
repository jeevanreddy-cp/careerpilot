import { useState } from "react";

function CareerChat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m CareerPilot. Ask me anything about careers, skills, internships, projects, resumes, or interviews.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to get AI response"
        );
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text: "Sorry, I could not answer right now. Please check that the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-section">
      <div className="chat-heading">
        <p className="roadmap-label">AI CAREER ASSISTANT</p>

        <h2>Ask CareerPilot</h2>

        <p>
          Get practical guidance about careers, skills,
          projects, internships, resumes, and interviews.
        </p>
      </div>

      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`chat-message ${
                item.role === "user"
                  ? "chat-message-user"
                  : "chat-message-assistant"
              }`}
            >
              <p>{item.text}</p>
            </div>
          ))}

          {loading && (
            <div className="chat-message chat-message-assistant">
              <p>CareerPilot is thinking...</p>
            </div>
          )}
        </div>

        <form
          className="chat-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Ask a career question..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CareerChat;