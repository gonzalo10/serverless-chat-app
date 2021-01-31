import { appPrefix } from '../constants';

export const getPeerId = (username) => appPrefix + username;

export const getUsername = (peerId) =>
	peerId ? peerId.slice(appPrefix.length) : '';
