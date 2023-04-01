import { AlertBuilder, DeNotifyClient, FilterBuilder } from 'denotify-client'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
	const api = await DeNotifyClient.create({
		email: process.env.EMAIL,
		password: process.env.PASSWORD,
		anonKey: process.env.ANON_KEY,
		projectId: process.env.PROJECT_ID
	})

	const network = 'ethereum'
	const contract = '0x000000000000Ad05Ccc4F10045630fb830B95127'
	const { abi, hash } = await api.getAbi(network, contract)
	const webhook = process.env.DISCORD_WEBHOOK as string
	const filter = FilterBuilder.new()
		.addCondition(
			'WHERE',
			'param_2_7',
			'Number',
			'gt',
			'20000000000000000000'
		)
		.finalise()

	// Create the Balance Monitor alert
	const alert = await AlertBuilder.create('Test Alert')
		.onNetwork('ethereum')
		.withTrigger('OnchainEventV2', {
			abiHash: hash,
			addresses: [contract],
			event: 'OrdersMatched',
			triggerOn: 'filter',
			filter
		})
		.withNotification('Discord', {
			url: webhook,
			username: 'Blur Bot',
			message: `\n**Collection**: {NFTCollection(param_2_3)}\n**Token ID**: {param_2_4}\n**Price:** {format(param_2_7 / 1e18)} WETH {toUsd(WETH, param_2_7)}\n{txHash}`,
			avatar_url: `https://img.api.cryptorank.io/coins/blur1668152400608.png`,
			embed: {
				title: 'NFT Sale!',
				image: {
					// url: png
				},
				thumbnail: {
					url: 'https://img.api.cryptorank.io/coins/blur1668152400608.png'
				}
			}
		})
		.config()

	const abis: any = {}
	abis[hash] = abi
	// This works out what fields are available for filters and notifications
	const fields = api.readFields(alert.triggerId, alert.trigger, abis)
	console.log(fields)

	const alertId = await api.createAlert(alert)
}

void main()
