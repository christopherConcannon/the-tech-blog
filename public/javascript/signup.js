async function signupFormHandler(event) {
	event.preventDefault();

	const username = document.querySelector('#username-signup').value.trim();
	const password = document.querySelector('#password-signup').value.trim();

	// if all signup fields are filled out, make POST request to api/users route to create new user
	if (username && password) {
		const response = await fetch('/api/users', {
			method  : 'post',
			body    : JSON.stringify({
				username,
				password
			}),
			headers : { 'Content-Type': 'application/json' }
		});
		console.log(response);

		// check the response status
		if (response.ok) {
			document.location.replace('/dashboard/');
		} else {
			alert(response.statusText);
		}
	}
}

document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);
