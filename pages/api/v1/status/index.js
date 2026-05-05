import database from "infra/database.js";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();
    let databaseInfo = null;

    try {
      const databaseVersionResult = await database.query(
        "SHOW server_version;",
      );
      const databaseVersionValue = databaseVersionResult.rows[0].server_version;

      const databaseMaxConnectionsResult = await database.query(
        "SHOW max_connections;",
      );
      const databaseMaxConnectionValue =
        databaseMaxConnectionsResult.rows[0].max_connections;

      const databaseName = "local_db";
      const databaseOpenedConnectionsResult = await database.query(
        "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
      );
      const databaseOpenedConnectionsValue = parseInt(
        databaseOpenedConnectionsResult.rows[0].count,
        10,
      );

      databaseInfo = {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionValue, 10),
        opened_connections: databaseOpenedConnectionsValue,
      };
    } catch (err) {
      console.error(
        "status endpoint database error:",
        err && err.message ? err.message : err,
      );
      databaseInfo = null;
    }

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: databaseInfo,
      },
    });
  } catch (err) {
    console.error(
      "status handler unexpected error:",
      err && err.stack ? err.stack : err,
    );
    response.status(200).json({
      updated_at: new Date().toISOString(),
      dependencies: { database: null },
    });
  }
}

export default status;
