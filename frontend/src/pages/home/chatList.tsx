import { useState } from "react";
import "../../styles/chatList.css";
import "../../styles/style.css";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';



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
  const { ChatListData, fetchMessages, selectedIndex, setSeletedIndex } = props;

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


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export function UserList(props) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{textAlign:"center"}} id="modal-modal-title" variant="h6" component="h2">
          User List
        </Typography>

<div className="between">

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      Nishal
        </Typography>        
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      Add
        </Typography>

</div>


      </Box>
    </Modal>
  </div>
);
  
}