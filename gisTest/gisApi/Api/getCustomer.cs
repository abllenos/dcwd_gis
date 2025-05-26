using System;
using Npgsql;

namespace gisApi.Api
{
    internal class getCustomer
    {
        public void FetchCustomer()
        {
            Conn db = new Conn();
            using (NpgsqlConnection connection = db.GetConnection())
            {
                try
                {
                    connection.Open();
                    Console.WriteLine("Connection Successful!");

                    string query = "SELECT * FROM customer";
                    using (var command = new NpgsqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Console.WriteLine($"accountnumber: {reader["accountnumber"]}, name: {reader["name"]}, meternumber: {reader["meternumber"]}");
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