using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using final_proj_server.Models.DBServices;

namespace final_proj_server.Models
{
    public class Job
    {
        string id;
        string title;
        string company;
        string createdAt;
        string url;
        string companyLogo;

        public Job()
        {

        }

        public Job(string id, string title, string company, string createdAt, string url, string companyLogo)
        {
            Id = id;
            Title = title;
            Company = company;
            CreatedAt = createdAt;
            Url = url;
            CompanyLogo = companyLogo;
        }

        public string Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string Company { get => company; set => company = value; }
        public string CreatedAt { get => createdAt; set => createdAt = value; }
        public string Url { get => url; set => url = value; }
        public string CompanyLogo { get => companyLogo; set => companyLogo = value; }

        public static int Insert(string username, Job job)
        {
            JobsDBService jobsDBService = new JobsDBService();
            int numAffected = jobsDBService.insert(username, job);
            return numAffected;
        }


        public static List<Job> GetAll(string username)
        {
            JobsDBService jobsDBService = new JobsDBService();
            List<string> jobIds = jobsDBService.getJobIds(username);
            List<Job> jobList = new List<Job>();

            foreach (string id in jobIds)
            {
                jobList.Add(jobsDBService.getJobById(id));
            }
            return jobList;
        }
    }
}