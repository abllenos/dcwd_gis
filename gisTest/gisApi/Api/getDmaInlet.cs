using System;
using Npgsql;

namespace gisApi.Api
{
    internal class getDmaInlet
    {
        public void FetchDmaInlet()
        {
            Conn db = new Conn();

            using (NpgsqlConnection connection = db.GetConnection())
            {
                try
                {
                    connection.Open();
                    Console.WriteLine("Connection successful!");

                    string query = "SELECT * FROM dcwd_dma_inlet";

                    using (var command = new NpgsqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Console.WriteLine($"gid: {reader["gid"]}, dma_code: {reader["dma_code"]}, landmark: { reader["landmark"]}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Connection failed: " + ex.Message);
                }
            }
        }
    }
}
