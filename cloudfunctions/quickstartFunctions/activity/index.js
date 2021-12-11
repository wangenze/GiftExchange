const { init, DYNAMIC_CURRENT_ENV, database, getWXContext } = require('wx-server-sdk');
const { getCurrentUser } = require('../user');

init({
  env: DYNAMIC_CURRENT_ENV
});
const db = database();
const _ = db.command

const NOT_STARTED = 'NOT_STARTED'
const FINISHED = 'FINISHED'

exports.main = async (event, context) => {
  switch (event.action) {
    case 'createActivity':
      return await createActivity(event, context);
    case 'joinActivity':
      return await joinActivity(event, context);
    case 'exitActivity':
      return await exitActivity(event, context);
    case 'getCurrentActivity':
      return await getCurrentActivity(event, context);
    default:
      return {
        success: false,
          errMsg: 'Unsupported action: ' + event.action
      }
  }
}

async function createActivity(event, context) {
  const user = await getCurrentUser();
  const activityCreateRes = await db.collection('gift_activity').add({
    data: {
      creator: user._openid,
      createTime: Date.now(),
      updateTime: Date.now(),
      members: [{
        user_openid: user._openid,
        user_public_key: event.data.publicKey
      }],
      status: NOT_STARTED
    }
  })
  await db.collection('gift_user').doc(user._id).update({
    data: {
      activityId: activityCreateRes._id,
      updateTime: Date.now()
    }
  })
  return await getCurrentActivity(event, context)
}

async function joinActivity(event, context) {
  const user = await getCurrentUser();
  if (user.activityId) {
    throw new Error('User already in an activity')
  }
  const activityJoinRes = await db.collection('gift_activity').where({
    _id: event.data.activityId,
    status: NOT_STARTED
  }).update({
    data: {
      members: _.addToSet({
        user_openid: user._openid,
        user_public_key: event.data.publicKey
      })
    }
  })
  if (activityJoinRes.stats.updated < 1) {
    console.log("Unable to join activity")
    return undefined
  }
  await db.collection('gift_user').doc(user._id).update({
    data: {
      activityId: event.data.activityId,
      updateTime: Date.now()
    }
  })
  return await getCurrentActivity(event, context)
}

async function exitActivity(event, context) {
  const user = await getCurrentUser();
  console.log(user)
  if (user.activityId) {
    // TODO: transactional
    await db.collection('gift_user').doc(user._id).update({
      data: {
        activityId: _.remove(),
        updateTime: Date.now()
      }
    })
    await db.collection('gift_activity').where({
      _id: user.activityId,
      status: NOT_STARTED
    }).update({
      data: {
        members: _.pull({
          user_openid: user._openid
        })
      }
    })
  }
  return undefined
}

async function getCurrentActivity(event, context) {
  user = await getCurrentUser();
  if (!user.activityId) {
    return undefined
  }
  const activityRes = await db.collection('gift_activity').doc(user.activityId).get()
  const activity = activityRes.data
  return {
    ...activity,
    isCreator: user._openid === activity.creator
  };
}