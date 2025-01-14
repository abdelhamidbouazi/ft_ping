import axioss from "axios";

const axios = axioss.create({
	baseURL: `${process.env.NEXT_PUBLIC_IP_BACK}`,
	withCredentials: true,
})

export const getAllChannelsUrlEndpoint = "/channel";
export const getNotJoindChannelsUrlEndpoint = "channel/notjoinedchannel/in";
export const getJoinedChannelsUrlEndpoint = "/channel/mychannels/in";
export const getMyChannelsInvitesURLEndpoint = "/channel/invit/getter";
export const getBlockedUsersURLEndpoint = (id: string) => `/channel/baned/${id}`;
export const getChannelByIdURLEndpoint = (id: string) => `/channel/${id}`;
export const getDirectMessagesURLEndpoint = (username: string) => `chat/DM/${username}`;

export default  axios;