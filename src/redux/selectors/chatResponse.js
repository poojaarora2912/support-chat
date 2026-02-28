import _ from 'lodash';

export function selectChatSessionItems(state) {
  const sessionId = _.get(state, 'chatResponse.chatSession.currentSessionId');
  const pendingFirstMessage = _.get(state, 'chatResponse.chatSession.pendingFirstMessage');
  if (sessionId) {
    return _.get(state, `chatResponse.chatSession["${sessionId}"].items`, []);
  }
  if (pendingFirstMessage) {
    return [pendingFirstMessage];
  }
  return [];
}

export function selectChatFetching(state) {
  return _.get(state, 'chatResponse.chatSession.fetching', false);
}

export function selectCurrentSessionId(state) {
  return _.get(state, 'chatResponse.chatSession.currentSessionId', null);
}
