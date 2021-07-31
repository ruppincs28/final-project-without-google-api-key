using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace final_proj_server.Models.DBServices
{
    public class JobsDBService : DBService
    {
        public List<string> getJobIds(string username)
        {
            List<string> jobIdList = new List<string>();
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = $"SELECT * FROM jobsOfUsers_native_final_cs WHERE username='{username}'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    jobIdList.Add((string)dr["Jobid"]);
                }

                return jobIdList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        public Job getJobById(string jobId)
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = $"SELECT * FROM jobs_native_final_cs WHERE id='{jobId}'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                // empty job instance
                Job j = new Job();

                while (dr.Read())
                {   // Read till the end of the data into a row

                    j.Id = (string)dr["Id"];
                    j.Title = (string)dr["Title"];
                    j.Company = (string)dr["Company"];
                    j.CreatedAt = (string)dr["Createdat"];
                    j.Url = (string)dr["Url"];
                    j.CompanyLogo = (string)dr["Companylogo"];
                }

                // we know there is only one job per id
                return j;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        public int insert(string username, Job job)
        {
            SqlConnection con;
            SqlCommand cmdJob, cmdJobOfUser;

            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStrJob = BuildInsertCommandJob(job);      // helper method to build the insert string
            String cStrJobOfUser = BuildInsertCommandJobOfUser(username, job.Id);      // helper method to build the insert string

            cmdJob = CreateCommand(cStrJob, con);             // create the command
            cmdJobOfUser = CreateCommand(cStrJobOfUser, con);             // create the command

            try
            {
                int numEffected;
                try
                {
                    numEffected = cmdJob.ExecuteNonQuery(); // execute the command
                }
                catch (Exception ex)
                {
                    // throws err if 'general' job entry exists, we are fine with this
                    numEffected = 0;
                    Console.WriteLine(ex);
                }
                numEffected = cmdJobOfUser.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);

            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        private String BuildInsertCommandJob(Job job)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}')", job.Id, job.Title, job.Company, job.CreatedAt, job.Url, job.CompanyLogo);
            String prefix = "INSERT INTO jobs_native_final_cs " + "([id], [title], [company], [createdat], [url], [companylogo]) ";
            command = prefix + sb.ToString();

            return command;
        }

        private String BuildInsertCommandJobOfUser(string username, string jobId)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values(N'{0}', N'{1}')", username, jobId);
            String prefix = "INSERT INTO jobsOfUsers_native_final_cs " + "([username], [jobid]) ";
            command = prefix + sb.ToString();

            return command;
        }
    }
}