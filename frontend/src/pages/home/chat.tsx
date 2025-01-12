import { useEffect, useRef, useState } from "react";
import "../../styles/chat.css";
import "../../styles/style.css";
import { storedUserId } from "../../utils/functions";

function Chat(props) {
  const { Messages, setMessages, sendMessage, chatName } = props;
  const [text, setText] = useState("");

  const onChange = (event) => {
    if (event) {
      let value = event.target.value;
      setText(value);
    }
  };

  const onSend = () => {
    sendMessage(text);
  };

  return (
    <div className="chat-div">
      <div className="chat-profile">
        <h4>{chatName}</h4>
      </div>

      {/* chatting display */}
      {Messages.map((i, index) => (
        <div className="chat-box">
          <div
            className={
              Number(i.sender_id) === Number(storedUserId)
                ? "chat-box-container-user"
                : "chat-box-container-chatter"
            }
          >
            <p>{i.content}</p>
          </div>
        </div>
      ))}

      {/* fixed inputbox */}

      <div className="chat-input-div">
        <textarea
          className="chat-input-box"
          placeholder="Type here...."
          value={text}
          onChange={onChange}
        ></textarea>
        <button onClick={onSend} className="chat-send-btn">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
