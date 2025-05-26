using MySql.Data.MySqlClient;

namespace gisApi.Api
{
    internal class Conn
    {
        private readonly string connectionString = "Server=192.100.140.197;Database=db_gis_mgt;User Id=root;Password=tobisedi110373;";

        public MySqlConnection GetConnection()
        {
            return new MySqlConnection(connectionString);
        }
    }
}