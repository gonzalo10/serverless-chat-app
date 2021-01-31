import { useState } from 'react';

const Chat = ({ chats, sendMessage }) => {
	const [messageText, setMessageText] = useState();
	const handleSendMessage = (e) => {
		e.preventDefault();
		sendMessage(messageText);
	};
	const hanldeInput = (e) => {
		setMessageText(e.target.value);
	};
	console.log(chats);
	return (
		<div>
			<div>
				{chats.map((chat) => {
					return (
						<div>
							<span>{chat.message}</span>
						</div>
					);
				})}
			</div>
			<form onSubmit={handleSendMessage}>
				<input onChange={hanldeInput} />
			</form>
		</div>
	);
};

export default Chat;
