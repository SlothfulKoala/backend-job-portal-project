# Seeker Workflow
## POST /api/auth/signup

body:
{
    "name": "Anish",
    "email": "anish@example.com",
    "password": "12345",
    "role": "seeker",
    "profile": {
        "skills": [
        "JavaScript",
        "Node.js",
        "Express",
        "Thunder Client"
        ],
        "experience": 0,
        "resumeText": "4th-semester CS student at Chitkara University. I build secure REST APIs."
    }
}
Note: put the token we get back in auth/bearer in thunder

## GET /api/jobs
will return a list of all available jobs
copy the jobId of the job you want to apply to

## POST /api/applications/apply/:jobId
returns application status and applicationID

PATCH /api/users/profile
{
    "experience" : 100
} 

# Employer Workflow
## POST /api/auth/login

{
    "email": "hr@techcorp.com",
    "password": "password123"
}

## POST /api/jobs
{
    "title": "Example here here here",
    "type": "part-time",
    "salary": 10,
    "location": "Basement",
    "category": "Engineering",
    "description": "Looking for a backend developer who knows Express and JWTs!"
}

## GET /api/jobs/my-jobs
will return list of the current account's jobs
copy the JOB-ID of the job you want to check

## GET /api/jobs/applicants/:jobId
will return list of applicants of particular JOB-ID
copy the APPICANT-ID of the applicant you want to shortlist

## PATCH /api/applications/shortlist/:applicationId
will update the application stored in database

## DELETE /api/jobs/:jobId
will delete the specified JOB-ID (the applications to this job will remain)

# Admin Workflow
## POST /api/auth/login 

## GET /api/admin/stats 
will return website statistics
## GET /api/admin/users 
will return a list of all users (the passwords will be stripper from the info)