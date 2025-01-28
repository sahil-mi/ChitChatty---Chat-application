import { useEffect, useState } from "react";
import "../../styles/chatList.css";
import "../../styles/style.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
  const { ChatListData, fetchMessages, selectedIndex, setSeletedIndex,handleAddUserOpen } = props;

  const [state, setState] = useState({});

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
        {/* <div className="profile-add-new">Add New</div> */}
        <Button onClick={handleAddUserOpen} className="profile-add-new" variant="outlined" color="white">Add New User</Button>
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function UserList(props) {
  const { fetchUsers, users,open,setOpen,handleOpen,handleClose,addToChatRoom } = props;

  const handleOnClick = (i)=>{
    let data = {
      name:i.first_name,
      participants:[i.id]
  }
    addToChatRoom(data)
  }


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ textAlign: "center" }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            User List
          </Typography>

          <ol>
            {users.map((i, index) => (
              <>
                <li className="between">
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {i.first_name + i.last_name}
                  </Typography>
                  <Button variant="text" onClick={()=>{handleOnClick(i)}} >Add</Button>
                </li>
              </>
            ))}
          </ol>
        </Box>
      </Modal>
    </div>
  );
}
