const dbConfig  = require("./utils/mongo-config");

const newTrackingUser = require("./DATABASE.json");


const compareTo = (newTracking, dataActual) => {
  return dataActual.some((trackingActual) => {
    if (
      trackingActual.type.code === newTracking.type.code &&
      trackingActual.module.code === newTracking.module.code &&
      trackingActual.subModule.code === newTracking.subModule.code &&
      trackingActual.detail.code === newTracking.detail.code
    ) {
      return true;
    }
    return false;
  });
};

const searchDiff = (db,dataActual, newTrackingData) => {
  const prima = newTrackingData.map( async (newTracking) => {
    const existe = compareTo(newTracking, dataActual);
    try {
      if (existe) {
        await dbConfig.updateTrackings(db, newTracking);
       } else await dbConfig.insertTracking(db, newTracking);
       
    } catch (error) {
      return true;
    }
  });
  return Promise.all(prima);
};

(async () => {
  try {
    let dbConnection = await dbConfig.connectToDatabase(dbConfig.MONGO_URL);
    if (!dbConnection)
      throw new Error("Cannot get the connection with the database");

     const dataActual= await dbConfig.listTrackingExists(dbConnection);
     
     await searchDiff(dbConnection,dataActual, newTrackingUser);

  } catch (error) {
    console.log(error);
  }
})();
