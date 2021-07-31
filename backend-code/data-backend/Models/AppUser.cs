using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using final_proj_server.Models.DBServices;

namespace final_proj_server.Models
{
    public class AppUser
    {
        string username;
        string password;
        string img;

        public AppUser()
        {

        }

        public AppUser(string username, string password, string img)
        {
            Username = username;
            Password = password;
            Img = img;
        }

        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }
        public string Img { get => img; set => img = value; }

        public static AppUser GetUser(string username)
        {
            UsersDBService usersDBService = new UsersDBService();
            AppUser returnVal = usersDBService.getUser(username);
            returnVal.Password = String.Empty;
            return returnVal;
        }

        public static AppUser ValidateUser(string username, string password)
        {
            UsersDBService usersDBService = new UsersDBService();
            AppUser returnVal = usersDBService.getUser(username);
            if (returnVal != null)
            {
                return returnVal.Password == password ? returnVal : null;
            }
            return returnVal;
        }

        public static int Insert(AppUser user)
        {
            UsersDBService usersDBService = new UsersDBService();
            int numAffected = usersDBService.insert(user);
            return numAffected;
        }

        public static void Delete(string username)
        {
            // read the discount table from the database into a dbs object
            UsersDBService usersDBService = new UsersDBService();
            usersDBService = usersDBService.readUser(username);

            foreach (DataRow dr in usersDBService.dt.Rows)
            {
                dr.Delete();
            }
            // update the DB
            usersDBService.update();
        }

    }
}