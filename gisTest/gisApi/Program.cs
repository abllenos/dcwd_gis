using System;
using gisApi.Api;

class Program
{
    static void Main()
    {
        getUseraccounts gua = new getUseraccounts();
        gua.FetchUserAccounts();
    }
}