import { useState } from "react";
import "../../styles/chatList.css";
import "../../styles/style.css";

export function ChatCard(props) {
  const { data, index, selectedIndex, on_card_click } = props;
  return (
    <div
      style={{
        backgroundColor: selectedIndex === index ? "#ededed" : "#FFFFFF",
      }}
      className="chat-card"
      onClick={() => {
        on_card_click(index);
      }}
    >
      <span className="new-message-indicator">
        {data.is_seen === false ? "•" : ""}
      </span>
      <div className="chat-card-name">
        <h4>{data.name}</h4>
        <p>{data.last_message}</p>
      </div>
      <p>{data.last_messaged_date}</p>
    </div>
  );
}

function ChatList(props) {
  const { ChatListData, fetchMessages } = props;

  const [state, setState] = useState({});

  const [selectedIndex, setSeletedIndex] = useState(0);

  const on_card_click = (index) => {
    const chat_id = ChatListData[index].id;
    setSeletedIndex(index);
    fetchMessages(chat_id);
  };

  return (
    <div className="chat-list-main-div">
      <div className="profile">
        <div className="profile-name">
          <h4>Sahil Mi</h4>
        </div>
        <div className="profile-add-new">Add New</div>
      </div>

      <div className="chat-list">
        {ChatListData.map((i, index) => (
          <ChatCard
            data={i}
            index={index}
            selectedIndex={selectedIndex}
            on_card_click={on_card_click}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatList;
