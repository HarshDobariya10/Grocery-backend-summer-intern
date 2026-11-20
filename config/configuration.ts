export default () => ({
    port: parseInt(process.env.PORT!, 10) || 2500,
    database: {
      url:
        process.env.DATABASE_URL ||
        'mysql://root:Root@123@localhost:3306/groceryApp',
    },
  });