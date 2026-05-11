export default function handler(req, res) {
  const status = {
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        version: "16.0",
        max_connections: 100,
        opened_connections: 1,
      },
    },
  };

  res.status(200).json(status);
}
