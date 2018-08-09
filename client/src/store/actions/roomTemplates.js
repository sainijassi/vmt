import * as actionTypes from './actionTypes';
import API from '../../utils/apiRequests';

export const gotRoomTemplates = (resource, templates) => {
  const type = (resource === 'room') ? actionTypes.GOT_ROOM_TEMPLATES : actionTypes.GOT_COURSE_TEMPLATES;
  return { type, templates, }
}

export const createdRoomTemplate = template => {
  return {
    type: actionTypes.CREATED_COURSE_TEMPLATE,
    template,
  }
}

export const getRoomTemplates = params => {
  return dispatch => {
    API.get('')
    .then(res => dispatch(gotRoomTemplates(res.data.results)))
  }

}

export const createRoomTemplate = (resource, body) => {
  return dispatch => {
    API.post(`${resource}Template`, body)
    .then(res => dispatch(createdRoomTemplate(resource, res.data.result)))
  }
}
