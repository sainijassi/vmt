import * as actionTypes from './actionTypes';
import auth from '../../utils/auth';
import { normalize } from '../utils/normalize';
import API from '../../utils/apiRequests';
import * as loading from './loading'
import { updateCourse, gotCourses } from './courses';
import { updateRoom } from './rooms';


export const gotUser = user => {
  return {
    type: actionTypes.GOT_USER,
    user,
  }
}

export const removeUserCourse = courseId => {
  return {
    type: actionTypes.REMOVE_USER_COURSE,
    courseId,
  }
}

export const removeUserAssignment = assignmentId => {
  return {
    type: actionTypes.REMOVE_USER_ASSIGNMENT,
    assignmentId,
  }
}

export const updateUserCourses = newCourse => {
  return {
    type: actionTypes.UPDATE_USER_COURSES,
    newCourse,
  }
}

export const updateUserAssignments = newAssignment => {
  return {
    type: actionTypes.UPDATE_USER_ASSIGNMENTS,
    newAssignment,
  }
}

export const updateUserRooms = newRoom => {
  return {
    type: actionTypes.UPDATE_USER_ROOMS,
    newRoom,
  }
}

export const updateUserAccessNtfs = (resource, user) => {
  console.log('we ever getting here?')
  if (resource === 'course') {
    return {
      type: actionTypes.UPDATE_USER_COURSE_ACCESS_NTFS,
      user,
    }
  }
}

export const updateUserCourseTemplates = newTemplate => {
  return {
    type: actionTypes.UPDATE_USER_COURSE_TEMPLATES,
    newTemplate,
  }
}


export const updateUserRoomTemplates = newTemplate => {
  return {
    type: actionTypes.UPDATE_USER_ROOM_TEMPLATES,
    newTemplate,
  }
}

export const clearNotification = (ntfId, userId, resource, listType) => {
  return (dispatch) => {
    API.removeNotification(ntfId, userId, resource, listType)
    .then(res => {
      // dispatch(gotUser(res.data))
    })
    .catch(err => console.log(err))
  }
}

export const signup = body => {
  return dispatch => {
    dispatch(loading.start());
    auth.signup(body)
    .then(res => {
      if (res.data.errorMessage) return dispatch(loading.fail(res.data.errorMessage))
      dispatch(gotUser(res.data));
      dispatch(loading.success());
    })
    .catch(err => {
      dispatch(loading.fail('something went wrong'))})
  }
}

export const login = (username, password) => {
  return (dispatch, getState) => {
    dispatch(loading.start());
    auth.login(username, password)
    .then(res => {
      if (res.data.errorMessage) {return dispatch(loading.fail(res.data.errorMessage))}
      const courses = normalize(res.data.courses)
      // const assignments = normalize(res.data.assignments)
      dispatch(gotCourses(courses));
      const user = {
        ...res.data,
        courses: courses.allIds,
      }
      dispatch(gotUser(user))
      return dispatch(loading.success());
    })
    .catch(err => {
      dispatch(loading.fail(err.response.statusText))
    })
  }
}

export const requestAccess = (toUser, fromUser, resource, resourceId) => {
  return dispatch => {
    dispatch(loading.start());
    API.requestAccess(toUser, fromUser, resource, resourceId)
    .then(res => {
      return dispatch(loading.accessSuccess())
    })
    .catch(err => {
      return dispatch(loading.fail())})
  }
}

export const grantAccess = (user, resource, resourceId) => {
  return dispatch => {
    console.log(user, resource, resourceId)
    dispatch(loading.start())
    API.grantAccess(user, resource, resourceId)
    .then(res => {
      if (resource === 'room') {
        return dispatch(updateRoom(res.data.result))
      }
      console.log(res.data.result)
      // dispatch(updateUserCourses(resp.data.result)) @TODO Need to update the notifcations associated with this course
      dispatch(updateUserAccessNtfs(resource, user))
      return dispatch(updateCourse(res.data.result))
    })
  }
}

export const googleLogin = (username, password) => {
  return dispatch => {
    dispatch(loading.start());
    auth.googleLogin(username, password)
    .then(res => {
      dispatch(loading.success(res));
    })
    .catch(err => {
      dispatch(loading.fail(err));
    })
  }
}

export const clearError = () => {
  return {type: actionTypes.CLEAR_ERROR}
}
