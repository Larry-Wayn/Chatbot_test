document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.querySelector(".chat-input input");
    const sendButton = document.querySelector(".fa-paper-plane");
    const chatBox = document.querySelector(".chat-box");

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.style.margin = "10px 0";
        messageElement.style.padding = "8px";
        messageElement.style.borderRadius = "5px";
        messageElement.style.maxWidth = "70%";
        messageElement.style.wordWrap = "break-word";

        if (sender === "user") {
            messageElement.style.alignSelf = "flex-end";
            messageElement.style.backgroundColor = "#007bff";
            messageElement.style.color = "white";
            messageElement.style.textAlign = "right";
        } else {
            messageElement.style.alignSelf = "flex-start";
            messageElement.style.backgroundColor = "#e0e0e0";
            messageElement.style.color = "black";
        }

        messageElement.textContent = message;

        if (!chatBox.querySelector(".chat-messages")) {
            const messagesContainer = document.createElement("div");
            messagesContainer.classList.add("chat-messages");
            messagesContainer.style.overflowY = "auto";
            messagesContainer.style.flexGrow = "1";
            messagesContainer.style.maxHeight = "25vh";
            messagesContainer.style.display = "flex";
            messagesContainer.style.flexDirection = "column";
            chatBox.insertBefore(messagesContainer, chatBox.querySelector(".chat-input"));
        }

        const messagesContainer = chatBox.querySelector(".chat-messages");
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        appendMessage("user", userMessage);
        chatInput.value = "";

        // 调用后端 API
        fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage("ai", data.reply);
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("ai", "抱歉，出现了错误，请稍后再试。");
        });
    }

    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});