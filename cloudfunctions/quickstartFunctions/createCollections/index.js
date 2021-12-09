const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  createCollection('gift_user');
  createCollection('gift_activity');
  createCollection('gift_activity_');
  return {
    success: true
  };
};

const createCollection = function(collection)  {
  try {
    await db.createCollection(collection);
    console.log(`collection created: ${collection}`)
  } catch (e) {
    // do nothing if already exists
    console.log(`collection exists: ${collection}`)
  }
}
