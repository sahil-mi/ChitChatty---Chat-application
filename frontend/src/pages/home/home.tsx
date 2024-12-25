import "../../styles/home.css";
import "../../styles/style.css";
import Chat from "./chat";
import ChatList from "./chatList";

function Home() {
  return (
    <section>
      <div className="main-div">
        <ChatList />

        {/* =============== */}
        <Chat/>
      </div>
    </section>
  );
}

export default Home;
