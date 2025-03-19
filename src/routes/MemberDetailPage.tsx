import React, { useState } from "react";

const MemberDetail: React.FC = () => {
  const [username] = useState("ABCD0011");
  const [profilePic] = useState("https://via.placeholder.com/150");
  const email = "ABCD0011@student.monash.edu";
  const status = "In progess on Assignment 1 Introduction";

  
  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      {/* Profile Picture */}
      <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full border-4 border-purple-500" />
      

      {/* member's username */}
      <div className="mt-6 text-center">
        <h3 className="text-xl text-purple-400 font-semibold ">Username</h3>
        <p className="text-xl font-bold text-gray-300">{username}</p>
        
      </div>

      {/* member's email */}
      <div className="mt-6 text-center">
        <h3 className="text-xl text-purple-400 font-semibold">Email</h3>
        <p className="text-xl font-bold text-gray-300">{email}</p>
      </div>

      {/* member's status */}
      <div className="mt-6 text-center">
        <h3 className="text-xl text-purple-400 font-semibold">Status</h3>
        <p className="text-xl font-bold text-gray-300">{status}</p>
      </div>
    </div>
  );
};

export default MemberDetail;
