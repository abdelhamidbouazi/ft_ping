import { FC } from 'react'
import Channels from './ChannelsList'

const ChannelsList = ({ }) => {
	return <>
		<div className=' overflow-auto midnight border border-gray-600 rounded-md px-6 py-4 h-full'>
			<Channels />
		</div>
	</>
}

export default ChannelsList
