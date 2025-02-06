export const getCurrentIP = async (): Promise<string | false> => {
	const response = await fetch('https://api.ipify.org?format=json');

	if (response.status !== 200) {
		console.log(
			`[%c${new Date().toLocaleTimeString()}%c] Failed to fetch the latest IP address.`,
			'color: red',
			'color: initial',
		);
		return false;
	}

	const ipResponse: { ip: string } = await response.json();

	if (!ipResponse?.ip || !(new RegExp('^[\\d]{1,3}.[\\d]{1,3}.[\\d]{1,3}.[\\d]{1,3}$')).test(ipResponse?.ip)) {
		console.log(
			`[%c${new Date().toLocaleTimeString()}%c] Failed to grab the latest IP address from the IP response.`,
			'color: red',
			'color: initial',
		);
		return false;
	}

	console.log(
		`[%c${new Date().toLocaleTimeString()}%c] The current network IP is %c${ipResponse.ip}`,
		'color: green',
		'color: initial',
		'color: yellow',
	);

	return ipResponse.ip;
};
