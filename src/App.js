import { useState } from 'react'
import Peer from 'peerjs'

const Login = ({ setUserName, createPeer }) => {
	const [userInput, setUserInput] = useState('')
	const submitLogin = (e) => {
		e?.preventDefault()
		if (userInput.length > 0) {
			localStorage.setItem('username', userInput)
			createPeer()
		}
	}
	const handleUserName = (e) => {
		setUserName(e.target.value)
		setUserInput(e.target.value)
	}
	return (
		<div>
			Login
			<form onSubmit={submitLogin}>
				<input placeholder='username' onChange={handleUserName} />
			</form>
		</div>
	)
}
const TargetInput = ({ setTargetIdInput, submitConnection }) => {
	const submitLogin = (e) => {
		e?.preventDefault()
		submitConnection()
	}
	const hanleTargetInput = (e) => {
		setTargetIdInput(e.target.value)
	}
	return (
		<form onSubmit={submitLogin}>
			<label>Target Input</label>
			<input placeholder='username' onChange={hanleTargetInput} />
		</form>
	)
}

const appPrefix = 'secure-p2p-multichat-' // the prefix we will preprend to usernames

const oldChats = localStorage.getItem('chats')

const Chat = ({ chats, sendMessage }) => {
	const [messageText, setMessageText] = useState()
	const handleSendMessage = (e) => {
		e.preventDefault()
		sendMessage(messageText)
	}
	const hanldeInput = (e) => {
		setMessageText(e.target.value)
	}
	console.log(chats)
	return (
		<div>
			<div>
				{chats.map((chat) => {
					return (
						<div>
							<span>{chat.message}</span>
						</div>
					)
				})}
			</div>
			<form onSubmit={handleSendMessage}>
				<input onChange={hanldeInput} />
			</form>
		</div>
	)
}

let peer,
	peerIds = []

function App() {
	// const [peer, setPeer] = useState()
	const [userName, setUserName] = useState()
	const [targetIdInput, setTargetIdInput] = useState()
	const [hasConnection, setHasConnection] = useState(false)
	const [connections, setConnections] = useState({})
	// const [peerIds, setPeerIds] = useState([])
	const [chats, setChats] = useState([])

	const getPeerId = (username) => appPrefix + username
	const getUsername = (peerId) => (peerId ? peerId.slice(appPrefix.length) : '')

	const updatePeerIds = (connectionList) => {
		peerIds = Object.keys(connectionList)
	}

	const addConnection = (conn) => {
		console.log('add connection')
		const updatedConnections = { ...connections, [conn.peer]: conn }
		updatePeerIds(updatedConnections)
		setConnections(updatedConnections)
		console.log(`Connected to ${conn.peer}!`)
	}

	const createPeer = () => {
		peer = new Peer(getPeerId(userName))

		peer.on('open', () => {
			setHasConnection(true)
		})
		peer.on('error', (error) => {
			console.error(error)
			if (error.type === 'peer-unavailable') {
				console.error(`${targetIdInput} is unreachable!`)
			} else if (error.type === 'unavailable-id') {
				console.error(`${userName} is already taken!`)
			} else console.error(error)
		})
		peer.on('connection', (conn) => {
			if (!peerIds.includes(conn.peer)) {
				configureConnection(conn)

				conn.on('open', () => {
					addConnection(conn)
					conn.send({
						type: 'connections',
						peerIds: peerIds
					})
				})
			}
		})
	}

	const initiateConnection = (peerId) => {
		if (!peerIds.includes(peerId) && peerId !== peer.id) {
			console.log(`Connecting to ${peerId}...`)
			console.log('initiateConnection', peerIds)
			const options = {
				metadata: {
					peerIds
				},
				serialization: 'json'
			}
			console.log(peerId, options)
			const conn = peer.connect(peerId, options)
			configureConnection(conn)

			conn.on('open', () => {
				addConnection(conn)
				if (getUsername(conn.peer) === targetIdInput) {
					console.log('connectetd')
				}
			})
		}
	}

	const configureConnection = (conn) => {
		conn.on('data', (data) => {
			console.log({ data })
			if (data.type === 'connections') {
				data.peerIds.forEach((peerId) => {
					if (!connections[peerId]) {
						initiateConnection(peerId)
					}
				})
			} else if (data.type === 'chat') {
				receiveChat(data.chat)
			}
			// please note here that if data.type is undefined, this endpoint won't do anything!
		})
		conn.on('close', () => {
			console.log('connectin close')
			removeConnection(conn)
		})
		conn.on('error', (err) => {
			console.log('connectin error', err)
			removeConnection(conn)
		})

		// if the caller joins have a call, we merge calls
		conn.metadata.peerIds.forEach((peerId) => {
			if (!connections[peerId]) {
				initiateConnection(peerId)
			}
		})
	}
	const submitConnection = () => {
		const peerId = getPeerId(targetIdInput)
		initiateConnection(peerId)
	}
	const removeConnection = (conn) => {
		const updatedConnections = { ...connections }
		delete updatedConnections[conn.peer]
		setConnections(updatedConnections)
		updatePeerIds(updatedConnections)
	}
	const receiveChat = (chat) => {
		const updatedChats = [...chats, chat]
		setChats(updatedChats)
		localStorage.setItem('chats', JSON.stringify(updatedChats))
	}
	const submitChat = (messageText) => {
		if (messageText.length > 0) {
			const chat = {
				sender: userName,
				message: messageText,
				timestamp: new Date().getTime()
			}
			Object.values(connections).forEach((conn) => {
				conn.send({
					type: 'chat',
					chat
				})
			})
		}
	}

	const disconnectPeer = () => {
		peer.disconnect()
	}

	if (hasConnection)
		return (
			<div>
				<TargetInput
					setTargetIdInput={setTargetIdInput}
					submitConnection={submitConnection}
				/>
				<button onClick={disconnectPeer}>Disconnect</button>
				<Chat sendMessage={submitChat} chats={chats} />
			</div>
		)
	return <Login createPeer={createPeer} setUserName={setUserName} />
}

export default App
