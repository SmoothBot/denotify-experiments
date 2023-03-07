import { DeNotifyClient } from 'denotify-client';

// Simple App to demonstrate deleting an alert
async function main() {
	const api = await DeNotifyClient.create({
		email: 's.battenally@gmail.com',
		password: 'Password'
	});

	const alerts = await api.getAlerts();
	console.log(alerts);
}

void main();
