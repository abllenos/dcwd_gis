using Npgsql; 

namespace gisApi.Api
{
    internal class Conn
    {
        private readonly string connectionString = "Host=192.100.140.198;Port=5432;Database=db_gis;Username=controller;Password=dcwd@110373";

        public NpgsqlConnection GetConnection()
        {
            return new NpgsqlConnection(connectionString);
        }
    }
}
