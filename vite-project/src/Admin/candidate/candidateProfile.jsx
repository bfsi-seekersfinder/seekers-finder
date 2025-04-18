import React from 'react';
import { Card, Avatar, Button } from 'antd';


const CandidateProfile = ({close, candidate}) => {
  return (
    <div className='flex flex-col w-full  h-[90vh] overflow-y-auto bg-slate-200' style={{scrollbarWidth:'none'}}>
        <div className='px-6 pt-5'>
        <Button onClick={()=>close(false)}>Back</Button>
        </div>
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-slate-200  w-full">
      {/* Left Side */}
      <div className="w-full md:w-1/3 flex gap-4 flex-col  space-y-4 ">
        {/* Profile Box */}
        <Card className="shadow-md">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mt-2">{candidate.fullName}</h2>
            <p className="text-gray-600 capitalize">{Array.isArray(candidate.workExperience) && candidate?.workExperience[0]?.name? candidate?.workExperience[0]?.name : ''}</p>
            <p className="text-gray-500 text-sm capitalize ">{Array.isArray(candidate.workExperience) && candidate?.workExperience[0]?.designation? candidate?.workExperience[0]?.designation : ''}</p>
            
          </div>
        </Card>

        {/* Social Media Box */}
        <Card title="Connect" className="shadow-md">
          <div className="flex flex-col justify-around text-xl text-gray-600">
          <p className='text-sm'><strong>Contact : </strong>{candidate.mobileNo?? candidate["mobile number"]?? candidate["mobile no"]?? 'NA'}</p>
          <p className='text-sm'><strong>Email :</strong> {candidate.email?? candidate.Email?? 'NA'}</p>
          <p className='text-sm'><strong>State :</strong> {candidate.userLocation.state?? 'NA'}</p>
          <p className='text-sm capitalize'><strong>City :</strong> {candidate.userLocation.city?? 'NA'}</p>

          </div>
        </Card>
      </div>

      {/* Right Side */}
      <div className="w-full flex flex-col gap-4 md:w-2/3 space-y-4">
            {Array.isArray(candidate.workExperience) && candidate.workExperience.map((exp, index) => (
         <Card title="Company Details" className="shadow-md">
                
          <p><strong>Company:</strong> {exp.name?? 'NA'} </p>
          <p><strong>Designation:</strong> {exp.designation?? 'NA'}</p>
          <p><strong>Product:</strong> {candidate.product?? ''} </p>
          <p><strong>Product:</strong> {candidate.noticePeriod?? ''} </p>
        </Card>
            ))
            }

        <Card title="Education" className="shadow-md">
          <p><strong>Degree:</strong> {Array.isArray(candidate.education) && candidate.education[0]?.name? candidate.education[0]?.name : 'NA'} </p>
          <p><strong>University:</strong> {Array.isArray(candidate.education) && candidate.education[0].universityName? candidate.education[0].universityName :'NA' } </p>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default CandidateProfile;
