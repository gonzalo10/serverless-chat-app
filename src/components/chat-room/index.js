import styled from 'styled-components';
import Chat from './chat';
import TargetUser from './target-user';
import { getUsername } from '../../utils';

const ChatRoomContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
`;

const TargetUserContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 25%;
	padding-left: 3%;
	padding-right: 2%;
`;

const ChatContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 92%;
	width: 98%;
	padding-left: 2%;
	padding-right: 3%;
	margin-top: 4%;
	margin-bottom: 4%;
`;

const AppTitleWrapper = styled.div`
	height: 100px;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const AppTitle = styled.h3``;

const TargetUserWrapper = styled.div`
	width: 100%;
	border: 1px solid #f3f6fb;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	background-color: #f3f6fb;
	padding: 20px;
	margin-bottom: 2em;
	box-shadow: 0 2px 5px -1px rgb(50 50 93 / 25%),
		0 1px 3px -1px rgb(0 0 0 / 30%);
`;

const LogoutContainer = styled.div`
	position: absolute;
	bottom: 2em;
	left: 2em;
`;

const UsernameWrapper = styled.div`
	padding-bottom: 20px;
	font-weight: 600;
`;

const UsernameText = styled.span`
	padding-left: 10px;
	font-weight: 400;
	color: #4ea8e1;
	font-weight: 800;
`;

const ConectedUsersLabel = styled.div`
	padding-bottom: 4px;
	width: fit-content;
	border-bottom: 2px solid black;
	font-weight: 600;
`;

const ChatRoom = ({
	userName,
	peerIds,
	setTargetIdInput,
	submitConnection,
	submitChat,
	chats,
	disconnectPeer,
}) => {
	return (
		<ChatRoomContainer>
			<TargetUserContainer>
				<AppTitleWrapper>
					<AppTitle>Talarian Chat</AppTitle>
				</AppTitleWrapper>
				<TargetUserWrapper>
					<TargetUser
						setTargetIdInput={setTargetIdInput}
						submitConnection={submitConnection}
					/>
				</TargetUserWrapper>
				<TargetUserWrapper>
					<UsernameWrapper>
						Username: <UsernameText>{userName}</UsernameText>
					</UsernameWrapper>
					<ConectedUsersLabel>Connected Users</ConectedUsersLabel>
					<ul>
						<li>{getUsername(peerIds[0])}</li>
					</ul>
				</TargetUserWrapper>
			</TargetUserContainer>
			<ChatContainer>
				<Chat sendMessage={submitChat} chats={chats} userName={userName} />
			</ChatContainer>
			<LogoutContainer>
				<button onClick={disconnectPeer}>Disconnect</button>
			</LogoutContainer>
		</ChatRoomContainer>
	);
};

export default ChatRoom;
