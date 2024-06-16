db.createUser(
  {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
      roles: [
          {
              role: "readWrite",
              db: process.env.MONGODB_NAME
          }
      ]
  }
);
db.createCollection("test");
