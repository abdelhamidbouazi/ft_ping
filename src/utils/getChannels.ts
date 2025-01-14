
import axios, { getMyChannelsInvitesURLEndpoint, getNotJoindChannelsUrlEndpoint, getJoinedChannelsUrlEndpoint, getBlockedUsersURLEndpoint } from "@/app/api/axios";

export async function getChannels() {
	try {
        const { data } = await axios.get(getNotJoindChannelsUrlEndpoint);
        return data;
    } catch (error) {
        throw new Error(`Failed to get channels: ${error}`);
    }
}
export async function getJoinedChannels() {
	try {
		const { data } = await axios.get(getJoinedChannelsUrlEndpoint);
		return data;
	} catch (error) {
		throw new Error(`Failed to get joined channels: ${error}`);
	}
}
export async function getMyChannelsInvites() {
	try {
		const { data } = await axios.get(getMyChannelsInvitesURLEndpoint);
		return data;
	}
	catch (error) {
		throw new Error(`Failed to get invites: ${error}`);
	}
}
export async function getBlockedUsers( url ) {
	try {
		const { data } = await axios.get(url)
		return data;
	}
	catch (error) {
		throw new Error(`Failed to get blocked users: ${error}`);
	}
}
export async function getChannelById( url ) {
	try {
		const { data } = await axios.get(`/channel/${url}`);
		return data;
	}
	catch (error) {
		throw new Error(`Failed to get channel with id: ${error}`);
	}
}

export async function getChannelIdByTitle(title) {
	const channels = await getChannels();
	const channel = channels.find((channel) => channel.title === title);
	return channel ? channel.id : null;
}
