-- Final-Native-Proj
CREATE TABLE [users_native_final_cs] (
		[username] nvarchar (100) PRIMARY KEY ,
        [password] nvarchar (100) NOT NULL ,
		[img] nvarchar (1000) NOT NULL,
)


CREATE TABLE [jobs_native_final_cs] (
	[id] nvarchar(36) PRIMARY KEY,
    [title]  nvarchar (100) NOT NULL ,
    [company] nvarchar (100) NOT NULL,
	[createdat] nvarchar (1000) NOT NULL,
	[url] nvarchar (1000) NOT NULL,
	[companylogo] nvarchar (1000) NOT NULL
)


CREATE TABLE [jobsOfUsers_native_final_cs] (
	[username] nvarchar (100) REFERENCES users_native_final_cs([username]) ON DELETE CASCADE,
	[jobId] nvarchar(36) REFERENCES jobs_native_final_cs([id]) ,
	Primary key (username, jobId) 
)


select * from users_native_final_cs
select * from jobs_native_final_cs
select * from jobsOfUsers_native_final_cs


drop table [users_native_final_cs]
drop table [jobs_native_final_cs]
drop table [jobsOfUsers_native_final_cs]


DELETE FROM users_native_final_cs
DELETE FROM jobs_native_final_cs
DELETE FROM jobsOfUsers_native_final_cs


INSERT INTO users_native_final_cs ([username], [password], [img]) 
Values(N'lxnt', N'lxnt', N'https://i2-prod.irishmirror.ie/incoming/article22680559.ece/ALTERNATES/s615b/2_Liverpool-FC-v-Aston-Villa-Premier-League.jpg')

INSERT INTO jobs_native_final_cs ([id], [title], [company], [createdat], [url], [companylogo]) 
Values(N'0a8dd9c0-6b66-44be-99b0-cca5c3556ca7', N'sakit', N'Sakitsh0k0', N'Thu Feb 11 18:15:21 UTC 2021', N'https://jobs.github.com/positions/fb73d8f4-6cf4-4559-9fc8-ce5e358bfafd', N'https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdkdZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e6c1af228b81fb2fd01c6b28b93d9a12bc7944a8/CPS-Logo-high-res2.jpg')

INSERT INTO jobsOfUsers_native_final_cs ([username], [jobid]) 
Values(N'lxnt', N'0a8dd9c0-6b66-44be-99b0-cca5c3556ca7')
