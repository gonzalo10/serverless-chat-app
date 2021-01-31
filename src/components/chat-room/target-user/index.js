import styled from 'styled-components';

const TargetUserWrapper = styled.form`
	padding: 1em;
	padding-left: 0;
	padding-top: 0.5em;
`;

const TargetUserLabel = styled.h4`
	margin: 0;
	margin-bottom: 20px;
	font-size: 20px;
`;

const TargetUserInput = styled.input`
	border-radius: 40px;
	padding: 8px;
	border: 1px solid whitesmoke;
	width: 90%;
	box-shadow: 0 2px 5px -1px rgb(50 50 93 / 25%),
		0 1px 3px -1px rgb(0 0 0 / 30%);
	font-size: 18px;
	padding-left: 20px;
	outline: none;
	&:focus {
		box-shadow: 0 0 3pt 2pt #faaf4c;
	}
`;

const TargetUser = ({ setTargetIdInput, submitConnection }) => {
	const submitLogin = (e) => {
		e?.preventDefault();
		submitConnection();
	};
	const hanleTargetInput = (e) => {
		setTargetIdInput(e.target.value);
	};
	return (
		<TargetUserWrapper onSubmit={submitLogin}>
			<TargetUserLabel>Target User</TargetUserLabel>
			<TargetUserInput placeholder='Username' onChange={hanleTargetInput} />
		</TargetUserWrapper>
	);
};

export default TargetUser;
