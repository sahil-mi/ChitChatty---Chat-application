import { useEffect, useState } from "react";
import "../../styles/home.css";
import "../../styles/style.css";
import Chat from "./chat";
import ChatList from "./chatList";

import api from "../../utils/api.js"


function Home() {

  const [state,setState]  = useState({
    ChatListData:[]
  })

  const fetchData = async () => {
    try {
      const response = await api.get("/api/chatrooms/");
      if (response.status === 200) {
        setState({ ...state, ChatListData: response.data });
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(()=>{
    fetchData()
  },[])



  return (
    <section>
      <div className="main-div">
        <ChatList ChatListData={state.ChatListData} />

        {/* =============== */}
        <Chat/>
      </div>
    </section>
  );
}

export default Home;
