import { useState } from 'react';
import styled from 'styled-components';

import BgShapes from './bg-shapes';

const LoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
	overflow: hidden;
	padding-top: 27vh;
`;

const Title = styled.h1`
	margin: 0;
	color: #faaf4c;
	letter-spacing: 0.2rem;
	font-size: 60px;
	word-spacing: 0.7rem;
	text-transform: uppercase;
	padding-bottom: 32px;
	font-family: 'Roboto', sans-serif;
`;
const SubTitle = styled.h2`
	margin: 0;
	font-size: 24px;
	padding-bottom: 3em;
`;

const LoginForm = styled.form`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	width: 35%;
	padding-bottom: 2em;
`;

const LoginInput = styled.input`
	border-radius: 40px;
	padding: 12px;
	border: 1px solid whitesmoke;
	width: 265px;
	box-shadow: 0 2px 5px -1px rgb(50 50 93 / 25%),
		0 1px 3px -1px rgb(0 0 0 / 30%);
	font-size: 23px;
	padding-left: 30px;
	outline: none;
	&:focus {
		box-shadow: 0 0 3pt 2pt #faaf4c;
	}
`;

const LoginButton = styled.button`
	border-radius: 50px;
	padding: 11px;
	height: 60px;
	border: 1px solid #efa544;
	box-shadow: 0 2px 5px -1px rgb(50 50 93 / 25%),
		0 1px 3px -1px rgb(0 0 0 / 30%);
	font-size: 20px;
	background: #faaf4c;
	color: white;
	font-weight: 700;
`;

const Login = ({ setUserName, createPeer, error }) => {
	const [userInput, setUserInput] = useState('');
	const submitLogin = (e) => {
		e?.preventDefault();
		if (userInput.length > 0) {
			localStorage.setItem('username', userInput);
			createPeer();
		}
	};
	const handleUserName = (e) => {
		setUserName(e.target.value);
		setUserInput(e.target.value);
	};
	return (
		<LoginContainer>
			<BgShapes />
			<Title>Talarian Chat</Title>
			<SubTitle>Welcome to your Anonymous Chat App</SubTitle>
			<LoginForm onSubmit={submitLogin}>
				<LoginInput placeholder='Username' onChange={handleUserName} />
				<LoginButton type='submit'>GO!</LoginButton>
			</LoginForm>
			{error && error}
		</LoginContainer>
	);
};

export default Login;
