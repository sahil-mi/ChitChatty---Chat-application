import "../../styles/chat.css";
import "../../styles/style.css";

function Chat() {
  return (
<div className="chat-div">
<div className="chat-profile">
  <h4>Joseph william</h4>
</div>


{/* chatting display */}
<div className="chat-box">
<div className="chat-box-container-chatter">
  <p>Hi how are you ?</p>
</div>
<div className="chat-box-container-user">
  <p>Fine thanks</p>
</div>

<div className="chat-box-container-chatter">
  <p>Hi how are you ?</p>
</div>
<div className="chat-box-container-user">
  <p>Fine thanks</p>
</div>
<div className="chat-box-container-chatter">
  <p>Hi how are you ?</p>
</div>
<div className="chat-box-container-user">
  <p>Fine thanks</p>
</div>
<div className="chat-box-container-chatter">
  <p>Hi how are you ?</p>
</div>
<div className="chat-box-container-user">
  <p>Fine thanks</p>
</div>
<div className="chat-box-container-chatter">
  <p>Hi how are you ?</p>
</div>
<div className="chat-box-container-user">
  <p>Fine thanks</p>
</div>


</div>


{/* fixed inputbox */}

<div className="chat-input-div">
  {/* <input className="chat-input-box" placeholder="Type here"></input> */}
  <textarea className="chat-input-box" placeholder="Type here...."></textarea>
  <button className="chat-send-btn">Send</button>
</div>
  
</div>
  );
}

export default Chat;
