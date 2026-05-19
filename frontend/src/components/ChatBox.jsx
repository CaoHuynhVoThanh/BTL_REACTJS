import { useState } from "react";
import { apiPath } from "../utils/api";
import "./ChatBox.css";

const initialMessages = [
    {
        role: "assistant",
        content: "Chào bạn, mình có thể tư vấn nhanh về máy ảnh, ống kính, giỏ hàng hoặc thanh toán.",
    },
];

function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const text = input.trim();
        if (!text || isSending) return;

        const nextMessages = [...messages, { role: "user", content: text }];
        setMessages(nextMessages);
        setInput("");
        setError("");
        setIsSending(true);

        try {
            const response = await fetch(apiPath("/chatbot/"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: messages.map(({ role, content }) => ({ role, content })),
                }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.detail || "Chatbot đang bận, bạn thử lại sau nhé.");
            }

            setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={`chatbox-widget${isOpen ? " open" : ""}`}>
            {isOpen && (
                <section className="chatbox-panel" aria-label="Chat hỗ trợ">
                    <div className="chatbox-header">
                        <div>
                            <strong>Fuji Assistant</strong>
                            <span>Hỗ trợ nhanh</span>
                        </div>
                        <button type="button" className="chatbox-close" onClick={() => setIsOpen(false)} aria-label="Đóng chat">
                            x
                        </button>
                    </div>

                    <div className="chatbox-messages">
                        {messages.map((message, index) => (
                            <div className={`chatbox-message ${message.role}`} key={`${message.role}-${index}`}>
                                {message.content}
                            </div>
                        ))}
                        {isSending && <div className="chatbox-message assistant">Đang trả lời...</div>}
                    </div>

                    {error && <div className="chatbox-error">{error}</div>}

                    <form className="chatbox-form" onSubmit={handleSubmit}>
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Nhập câu hỏi..."
                            aria-label="Tin nhắn"
                        />
                        <button type="submit" disabled={!input.trim() || isSending}>
                            Gửi
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className="chatbox-toggle"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? "Đóng chat" : "Mở chat"}
            >
                {isOpen ? (
                    "x"
                ) : (
                    <img src="/chatboxIcon.jpg" alt="" className="chatbox-toggle-icon" aria-hidden="true" />
                )}
            </button>
        </div>
    );
}

export default ChatBox;
