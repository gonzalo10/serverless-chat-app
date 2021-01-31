import { useState } from 'react';
import Peer from 'peerjs';

import ChatRoom from './components/chat-room';
import Login from './components/login';

import { getPeerId, getUsername } from './utils';

let peer,
	peerIds = [];

function App() {
	const [userName, setUserName] = useState();
	const [targetIdInput, setTargetIdInput] = useState();
	const [userConnected, setUserConnected] = useState([]);
	const [hasConnection, setHasConnection] = useState(false);
	const [connections, setConnections] = useState({});
	const [chats, setChats] = useState([]);
	const [error, setError] = useState('');

	// First Step: Create the peer for the new user
	const createPeer = () => {
		peer = new Peer(getPeerId(userName));

		peer.on('open', () => {
			setHasConnection(true);
		});
		peer.on('error', (error) => {
			console.error(error);
			if (error.type === 'peer-unavailable') {
				console.error(`${targetIdInput} is unreachable!`);
				setError(`${targetIdInput} is unreachable!`);
			} else if (error.type === 'unavailable-id') {
				console.error(`${userName} is already taken!`);
				setError(`${userName} is already taken!`);
			} else console.error(error);
		});
		peer.on('connection', (conn) => {
			if (!peerIds.includes(conn.peer)) {
				configureConnection(conn);

				conn.on('open', () => {
					addConnection(conn);
					conn.send({
						type: 'connections',
						peerIds: peerIds,
					});
				});
			}
		});
	};

	const updatePeerIds = (connectionList) => {
		peerIds = Object.keys(connectionList);
	};

	const addConnection = (conn) => {
		console.log('add connection');
		const updatedConnections = { ...connections, [conn.peer]: conn };
		updatePeerIds(updatedConnections);
		setConnections(updatedConnections);
		console.log(`Connected to ${conn.peer}!`);
	};

	const initiateConnection = (peerId) => {
		if (!peerIds.includes(peerId) && peerId !== peer.id) {
			console.log(`Connecting to ${peerId}...`);
			console.log('initiateConnection', peerIds);
			const options = {
				metadata: {
					peerIds,
				},
				serialization: 'json',
			};
			const conn = peer.connect(peerId, options);
			configureConnection(conn);

			conn.on('open', () => {
				addConnection(conn);
				if (getUsername(conn.peer) === targetIdInput) {
					setUserConnected([...userConnected, , targetIdInput]);
					console.log('connected');
				}
			});
		}
	};

	const configureConnection = (conn) => {
		conn.on('data', (data) => {
			if (data.type === 'connections') {
				data.peerIds.forEach((peerId) => {
					if (!connections[peerId]) {
						initiateConnection(peerId);
					}
				});
			} else if (data.type === 'chat') {
				receiveChat(data.chat);
			}
			// please note here that if data.type is undefined, this endpoint won't do anything!
		});
		conn.on('close', () => {
			console.log('connectin close');
			removeConnection(conn);
		});
		conn.on('error', (err) => {
			console.log('connectin error', err);
			removeConnection(conn);
		});

		// if the caller joins have a call, we merge calls
		conn.metadata.peerIds.forEach((peerId) => {
			if (!connections[peerId]) {
				initiateConnection(peerId);
			}
		});
	};
	const submitConnection = () => {
		const peerId = getPeerId(targetIdInput);
		initiateConnection(peerId);
	};
	const removeConnection = (conn) => {
		const updatedConnections = { ...connections };
		delete updatedConnections[conn.peer];
		setConnections(updatedConnections);
		updatePeerIds(updatedConnections);
	};
	const receiveChat = (chat) => {
		const updatedChats = [...chats, chat];
		setChats((chats) => [...chats, chat]);
		localStorage.setItem('chats', JSON.stringify(updatedChats));
	};
	const submitChat = (messageText) => {
		if (messageText.length > 0) {
			const chat = {
				sender: userName,
				message: messageText,
				timestamp: new Date().getTime(),
			};
			setChats((chats) => [...chats, chat]);
			Object.values(connections).forEach((conn) => {
				conn.send({
					type: 'chat',
					chat,
				});
			});
		}
	};
	const disconnectPeer = () => {
		peer.disconnect();
	};

	if (hasConnection)
		return (
			<ChatRoom
				userName={userName}
				peerIds={peerIds}
				setTargetIdInput={setTargetIdInput}
				submitConnection={submitConnection}
				submitChat={submitChat}
				chats={chats}
				disconnectPeer={disconnectPeer}
			/>
		);

	return (
		<Login error={error} createPeer={createPeer} setUserName={setUserName} />
	);
}

export default App;
