using System;
using gisApi.Api;

class Program
{
    static void Main()
    {
        getDmaInlet gua = new getDmaInlet();
        gua.FetchUserAccounts();
    }
}