const TargetUser = ({ setTargetIdInput, submitConnection }) => {
	const submitLogin = (e) => {
		e?.preventDefault();
		submitConnection();
	};
	const hanleTargetInput = (e) => {
		setTargetIdInput(e.target.value);
	};
	return (
		<form onSubmit={submitLogin}>
			<label>Target Input</label>
			<input placeholder='username' onChange={hanleTargetInput} />
		</form>
	);
};

export default TargetUser;
