import { useEffect, useRef, useState } from "react";
import "../../styles/home.css";
import "../../styles/style.css";
import Chat from "./chat";
import ChatList, { UserList } from "./chatList";

import api from "../../utils/api.js";

function Home() {
  const [selectedIndex, setSeletedIndex] = useState(0);

  const [state, setState] = useState({
    ChatListData: [],
  });

  const [Messages, setMessages] = useState([]);
  const [chatName, setChatName] = useState("");

  const socket = useRef(null);

  // connect to websocket
  const ConnectWebSocket = (roomName) => {
    socket.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

    socket.current.onopen = () => {
      //pass
    };
    socket.current.onclose = () => {
      //pass
    };

    socket.current.onmessage = (event) => {
      console.log(event.data, "=======eventdata");
      const messageData = JSON.parse(event.data);

      setMessages((prev) => [...prev, messageData]);
    };

    socket.current.onerror = (error) => {
      console.log(error, "socket error!");
    };

    return () => {
      if (socket.current) {
        socket.current.close();
        console.log("WebSocket connection closed");
      }
    };
  };

  const sendMessage = (text) => {
    if (socket.current && socket.current.readyState == WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ text, roomName: chatName }));
    }
  };

  const switchRoom = (newRoomName) => {
    if (socket.current) {
      socket.current.close();
    }
    ConnectWebSocket(newRoomName);
  };
  




  const fetchMessages = async (chat_id) => {
    try {
      const response = await api.get(`/api/messages/${chat_id}`);
      if (response.status === 200) {
        setMessages(response.data.data);
        setChatName(response.data.name);
        switchRoom(response.data.name)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/api/chatrooms/");
      if (response.status === 200) {
        setState({ ...state, ChatListData: response.data });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <div className="main-div">
        <ChatList
          ChatListData={state.ChatListData}
          fetchMessages={fetchMessages}
          selectedIndex={selectedIndex}
          setSeletedIndex={setSeletedIndex}
        />

        {/* =============== */}
        <Chat
          Messages={Messages}
          setMessages={setMessages}
          sendMessage={sendMessage}
          chatName={chatName}
          
        />

        {/* ====================== */}
        <UserList/>

      </div>
    </section>
  );
}

export default Home;
