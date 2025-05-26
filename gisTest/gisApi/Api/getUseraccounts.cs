using System;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

namespace gisApi.Api
{
    internal class getUseraccounts
    {
        public void FetchUserAccounts()
        {
            Conn db = new Conn();
            
            using (MySqlConnection connection = db.GetConnection())
            {
                try
                {
                    connection.Open();
                    Console.WriteLine("Connection Successful!");

                    string query = "SELECT empID, Last Name FROM useraccounts";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Console.WriteLine($"empID: {reader["empID"]}, LastName: { reader["LastName"]}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Connection Failed: " + ex.Message);
                }
            }
        }
    }
}