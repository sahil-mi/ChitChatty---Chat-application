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

  const [users, setUsers] = useState([]);
  const [AddUserOpen, setAddUserOpen] = useState(false);
  const handleAddUserOpen = () => setAddUserOpen(true);
  const handleAddUserClose = () => setAddUserOpen(false);

  const [Messages, setMessages] = useState([]);
  const [chatName, setChatName] = useState("");

  const socket = useRef(null);

  // connect to websocket
  const ConnectWebSocket = (roomName) => {
    const accessToken = localStorage.getItem("access_token");
    socket.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${accessToken}`);

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
        switchRoom(response.data.name);
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

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/");
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addToChatRoom = async (data) => {
    try {
      const response = await api.post("/api/chatrooms/", data);
      if (response.status === 201) { // Status 201 indicates successful creation
        setState((prevState) => ({
          ...prevState,
          ChatListData: [...prevState.ChatListData, response.data], // Append new chat room to the list
        }));
      }
    } catch (error) {
      console.error("Error adding chat room:", error);
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
          handleAddUserOpen={handleAddUserOpen}
        />

        {/* =============== */}
        <Chat
          Messages={Messages}
          setMessages={setMessages}
          sendMessage={sendMessage}
          chatName={chatName}
        />

        {/* ====================== */}
        <UserList fetchUsers={fetchUsers} users={users} setUsers={setUsers} open={AddUserOpen} setOpen={handleAddUserOpen} handleOpen={handleAddUserClose} handleClose={handleAddUserClose} addToChatRoom={addToChatRoom} />
      </div>
    </section>
  );
}

export default Home;
