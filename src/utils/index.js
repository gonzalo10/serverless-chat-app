import { appPrefix } from '../constants';

export const getPeerId = (username) => appPrefix + username;

export const getUsername = (peerId) => {
	console.log(peerId);
	return peerId ? peerId.slice(appPrefix.length) : '';
};
